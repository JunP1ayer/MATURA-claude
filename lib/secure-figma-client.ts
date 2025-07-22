// SecureFigmaClient - セキュアなFigmaクライアント
import { FigmaApiMonitor } from './figma-monitor';
import { FigmaSecurityMonitor, SecurityRequest, SecurityAnomaly } from './figma-security';

export interface SecureFigmaConfig {
  apiKey: string;
  teamId: string;
  enableMonitoring: boolean;
  enableSecurity: boolean;
  maxRetries: number;
  retryDelay: number;
  timeout: number;
}

export interface RequestContext {
  ip: string;
  userAgent?: string;
  headers?: Record<string, string>;
  sessionId?: string;
  userId?: string;
}

export class SecureFigmaClient {
  private monitor: FigmaApiMonitor;
  private security: FigmaSecurityMonitor;
  private config: SecureFigmaConfig;
  private rateLimiter: Map<string, number[]> = new Map();

  constructor(config: Partial<SecureFigmaConfig>) {
    this.config = {
      apiKey: '',
      teamId: 'default',
      enableMonitoring: true,
      enableSecurity: true,
      maxRetries: 3,
      retryDelay: 1000,
      timeout: 30000,
      ...config
    };

    if (!this.config.apiKey) {
      throw new Error('API key is required');
    }

    this.monitor = new FigmaApiMonitor(this.config.apiKey, this.config.teamId);
    this.security = new FigmaSecurityMonitor();

    // セキュリティアラートのハンドリング
    this.security.onAlert((anomaly: SecurityAnomaly) => {
      this.handleSecurityAlert(anomaly);
    });
  }

  async getFileSecurely(fileId: string, context: RequestContext): Promise<any> {
    return this.executeSecureRequest('GET', `/v1/files/${fileId}`, context);
  }

  async getFileNodesSecurely(fileId: string, nodeIds: string[], context: RequestContext): Promise<any> {
    const params = new URLSearchParams({ ids: nodeIds.join(',') });
    return this.executeSecureRequest('GET', `/v1/files/${fileId}/nodes?${params}`, context);
  }

  async getFileImagesSecurely(fileId: string, nodeIds: string[], context: RequestContext, options: any = {}): Promise<any> {
    const params = new URLSearchParams({
      ids: nodeIds.join(','),
      format: options.format || 'png',
      scale: options.scale || '1',
      ...options
    });
    return this.executeSecureRequest('GET', `/v1/images/${fileId}?${params}`, context);
  }

  private async executeSecureRequest(
    method: string,
    endpoint: string,
    context: RequestContext,
    body?: any
  ): Promise<any> {
    const fullUrl = `https://api.figma.com${endpoint}`;
    
    // セキュリティチェック
    if (this.config.enableSecurity) {
      const securityRequest: SecurityRequest = {
        ip: context.ip,
        endpoint,
        method,
        timestamp: new Date().toISOString(),
        userAgent: context.userAgent,
        headers: context.headers
      };

      const anomalies = this.security.checkAnomalies(securityRequest);
      if (anomalies.some(a => a.severity === 'CRITICAL' || a.severity === 'HIGH')) {
        throw new Error(`Security violation detected: ${anomalies.map(a => a.message).join(', ')}`);
      }
    }

    // Rate limiting
    await this.checkRateLimit(context.ip);

    // リトライ機能付きリクエスト実行
    return this.executeWithRetry(fullUrl, method, body, context);
  }

  private async executeWithRetry(
    url: string,
    method: string,
    body: any,
    context: RequestContext
  ): Promise<any> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        const response = this.config.enableMonitoring
          ? await this.monitor.makeRequest(url, {
              method,
              body: body ? JSON.stringify(body) : undefined,
              headers: {
                'Content-Type': 'application/json',
                'User-Agent': context.userAgent || 'MATURA-SecureClient/1.0',
                ...context.headers
              }
            })
          : await fetch(url, {
              method,
              body: body ? JSON.stringify(body) : undefined,
              headers: {
                'X-Figma-Token': this.config.apiKey,
                'Content-Type': 'application/json',
                'User-Agent': context.userAgent || 'MATURA-SecureClient/1.0',
                ...context.headers
              }
            });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // 429 (Rate Limit) の場合は指数バックオフでリトライ
          if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter ? parseInt(retryAfter) * 1000 : Math.pow(2, attempt) * 1000;
            await this.sleep(delay);
            continue;
          }

          // 5xx系エラーの場合はリトライ
          if (response.status >= 500) {
            lastError = new Error(`HTTP ${response.status}: ${errorData.err || 'Server error'}`);
            await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
            continue;
          }

          // 4xx系エラーの場合はリトライしない
          throw new Error(`HTTP ${response.status}: ${errorData.err || 'Client error'}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt === this.config.maxRetries - 1) {
          break;
        }

        await this.sleep(this.config.retryDelay * Math.pow(2, attempt));
      }
    }

    throw lastError || new Error('Request failed after maximum retries');
  }

  private async checkRateLimit(ip: string): Promise<void> {
    const now = Date.now();
    const key = `rate_limit:${ip}`;
    const requests = this.rateLimiter.get(key) || [];
    
    // 1分間以内のリクエストをフィルタ
    const validRequests = requests.filter(timestamp => now - timestamp < 60000);
    
    if (validRequests.length >= 30) { // 1分間30リクエスト制限
      const oldestRequest = Math.min(...validRequests);
      const waitTime = 60000 - (now - oldestRequest);
      await this.sleep(waitTime);
    }
    
    validRequests.push(now);
    this.rateLimiter.set(key, validRequests);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private handleSecurityAlert(anomaly: SecurityAnomaly): void {
    console.warn(`[SecureFigmaClient] Security Alert: ${anomaly.message}`, {
      type: anomaly.type,
      severity: anomaly.severity,
      ip: anomaly.request.ip,
      endpoint: anomaly.request.endpoint,
      timestamp: new Date().toISOString()
    });

    // 重要度が高い場合は追加処理
    if (anomaly.severity === 'CRITICAL' || anomaly.severity === 'HIGH') {
      // 一時的にIPをブロック
      this.temporaryBlockIP(anomaly.request.ip);
    }
  }

  private temporaryBlockIP(ip: string): void {
    // 簡易的なIP一時ブロック実装
    // 本番環境では、Redis等の外部ストレージを使用
    const blockedIPs = new Set<string>();
    blockedIPs.add(ip);
    
    // 1時間後にブロック解除
    setTimeout(() => {
      blockedIPs.delete(ip);
    }, 60 * 60 * 1000);
  }

  // 便利メソッド
  async getOptimizedFileData(fileId: string, context: RequestContext): Promise<any> {
    try {
      // 基本ファイル情報を取得
      const fileData = await this.getFileSecurely(fileId, context);
      
      // FigmaParserをインポート
      const { FigmaParser } = await import('./figma');
      
      // デザインシステム情報を抽出
      const colors = fileData.document ? FigmaParser.extractColors(fileData.document) : [];
      const fonts = fileData.document ? FigmaParser.extractFonts(fileData.document) : [];
      const components = fileData.document ? FigmaParser.extractComponents(fileData.document) : [];
      
      // 必要な情報のみを抽出して返す
      return {
        name: fileData.name,
        lastModified: fileData.lastModified,
        thumbnailUrl: fileData.thumbnailUrl,
        version: fileData.version,
        role: fileData.role,
        document: fileData.document,
        // デザインシステム情報を追加
        designSystem: {
          colors: colors.slice(0, 10),
          fonts: fonts.slice(0, 5),
          components: components.slice(0, 20)
        },
        // 軽量化のため、documentsの一部のみ
        pages: fileData.document?.children?.slice(0, 5) || [],
        frames: this.extractFrames(fileData.document),
        // メタデータ
        metadata: {
          requestTime: new Date().toISOString(),
          source: 'secure-figma-client',
          fileId
        }
      };
    } catch (error) {
      console.error(`[SecureFigmaClient] Failed to get optimized data for ${fileId}:`, error);
      throw error;
    }
  }
  
  private extractFrames(document: any): Array<{ id: string; name: string; bounds: any }> {
    const frames: Array<{ id: string; name: string; bounds: any }> = [];
    
    if (!document) return frames;
    
    const traverse = (node: any) => {
      if (node.type === 'FRAME' || node.type === 'COMPONENT') {
        frames.push({
          id: node.id,
          name: node.name,
          bounds: node.absoluteBoundingBox
        });
      }
      
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    
    traverse(document);
    return frames.slice(0, 50);
  }

  // 使用状況レポート
  getUsageReport(timeRange: 'today' | 'week' | 'month' = 'today') {
    return this.monitor.generateUsageReport(timeRange);
  }

  // エラー履歴取得
  getRecentErrors(limit = 10) {
    return this.monitor.getRecentErrors(limit);
  }

  // セキュリティ設定更新
  updateSecurityConfig(config: any) {
    this.security.updateConfig(config);
  }

  // クリーンアップ
  cleanup() {
    this.monitor.clearLogs();
    this.security.clearHistory();
    this.rateLimiter.clear();
  }
}