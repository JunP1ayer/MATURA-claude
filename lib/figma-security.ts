// FigmaSecurityMonitor - セキュリティ監視クラス
export interface SecurityRequest {
  ip: string;
  endpoint: string;
  method: string;
  timestamp: string;
  userAgent?: string;
  headers?: Record<string, string>;
}

export interface SecurityAnomaly {
  type: 'HIGH_FREQUENCY_ACCESS' | 'UNAUTHORIZED_IP' | 'OFF_HOURS_ACCESS' | 'SUSPICIOUS_PATTERN' | 'INVALID_USER_AGENT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  request: SecurityRequest;
}

export interface SecurityConfig {
  maxRequestsPerMinute: number;
  maxRequestsPerHour: number;
  allowedIPs: string[];
  businessHours: { start: number; end: number };
  blockedUserAgents: string[];
  enableOffHoursAlert: boolean;
  enableIPRestriction: boolean;
}

export class FigmaSecurityMonitor {
  private config: SecurityConfig;
  private requestHistory: Map<string, number[]> = new Map();
  private alertCallbacks: ((anomaly: SecurityAnomaly) => void)[] = [];

  constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      maxRequestsPerMinute: 30,
      maxRequestsPerHour: 1000,
      allowedIPs: [],
      businessHours: { start: 9, end: 18 },
      blockedUserAgents: ['bot', 'crawler', 'spider'],
      enableOffHoursAlert: true,
      enableIPRestriction: false,
      ...config
    };

    // 環境変数から設定を読み込み
    if (process.env.FIGMA_ALLOWED_IPS) {
      this.config.allowedIPs = process.env.FIGMA_ALLOWED_IPS.split(',').map(ip => ip.trim());
    }
    if (process.env.FIGMA_MAX_REQUESTS_PER_MINUTE) {
      this.config.maxRequestsPerMinute = parseInt(process.env.FIGMA_MAX_REQUESTS_PER_MINUTE);
    }
    if (process.env.FIGMA_ENABLE_IP_RESTRICTION === 'true') {
      this.config.enableIPRestriction = true;
    }
  }

  checkAnomalies(request: SecurityRequest): SecurityAnomaly[] {
    const anomalies: SecurityAnomaly[] = [];
    const now = Date.now();

    // 1. 高頻度アクセスチェック
    const frequencyAnomaly = this.checkFrequencyAnomaly(request, now);
    if (frequencyAnomaly) {
      anomalies.push(frequencyAnomaly);
    }

    // 2. 未許可IPチェック
    if (this.config.enableIPRestriction) {
      const ipAnomaly = this.checkIPAnomaly(request);
      if (ipAnomaly) {
        anomalies.push(ipAnomaly);
      }
    }

    // 3. 時間外アクセスチェック
    if (this.config.enableOffHoursAlert) {
      const timeAnomaly = this.checkTimeAnomaly(request);
      if (timeAnomaly) {
        anomalies.push(timeAnomaly);
      }
    }

    // 4. 疑わしいパターンチェック
    const patternAnomaly = this.checkSuspiciousPattern(request);
    if (patternAnomaly) {
      anomalies.push(patternAnomaly);
    }

    // 5. User-Agentチェック
    const userAgentAnomaly = this.checkUserAgentAnomaly(request);
    if (userAgentAnomaly) {
      anomalies.push(userAgentAnomaly);
    }

    // 異常を検知した場合、アラートを送信
    if (anomalies.length > 0) {
      anomalies.forEach(anomaly => this.sendAlert(anomaly));
    }

    return anomalies;
  }

  private checkFrequencyAnomaly(request: SecurityRequest, now: number): SecurityAnomaly | null {
    const key = `${request.ip}:${request.endpoint}`;
    const timestamps = this.requestHistory.get(key) || [];
    
    // 1分間以内のリクエスト数をカウント
    const oneMinuteAgo = now - 60 * 1000;
    const recentRequests = timestamps.filter(ts => ts > oneMinuteAgo);
    
    // 1時間以内のリクエスト数をカウント
    const oneHourAgo = now - 60 * 60 * 1000;
    const hourlyRequests = timestamps.filter(ts => ts > oneHourAgo);
    
    // リクエスト履歴を更新
    recentRequests.push(now);
    this.requestHistory.set(key, recentRequests);
    
    // 頻度チェック
    if (recentRequests.length > this.config.maxRequestsPerMinute) {
      return {
        type: 'HIGH_FREQUENCY_ACCESS',
        severity: 'HIGH',
        message: `高頻度アクセス検知: ${recentRequests.length}リクエスト/分 (制限: ${this.config.maxRequestsPerMinute})`,
        request
      };
    }
    
    if (hourlyRequests.length > this.config.maxRequestsPerHour) {
      return {
        type: 'HIGH_FREQUENCY_ACCESS',
        severity: 'MEDIUM',
        message: `時間当たりアクセス制限超過: ${hourlyRequests.length}リクエスト/時 (制限: ${this.config.maxRequestsPerHour})`,
        request
      };
    }

    return null;
  }

  private checkIPAnomaly(request: SecurityRequest): SecurityAnomaly | null {
    if (this.config.allowedIPs.length === 0) {
      return null;
    }

    const isAllowed = this.config.allowedIPs.some(allowedIP => {
      // CIDR記法の対応
      if (allowedIP.includes('/')) {
        return this.isIPInCIDR(request.ip, allowedIP);
      }
      return request.ip === allowedIP;
    });

    if (!isAllowed) {
      return {
        type: 'UNAUTHORIZED_IP',
        severity: 'HIGH',
        message: `未許可IPからのアクセス: ${request.ip}`,
        request
      };
    }

    return null;
  }

  private checkTimeAnomaly(request: SecurityRequest): SecurityAnomaly | null {
    const currentHour = new Date().getHours();
    const { start, end } = this.config.businessHours;

    if (currentHour < start || currentHour > end) {
      return {
        type: 'OFF_HOURS_ACCESS',
        severity: 'MEDIUM',
        message: `営業時間外アクセス: ${currentHour}時 (営業時間: ${start}-${end}時)`,
        request
      };
    }

    return null;
  }

  private checkSuspiciousPattern(request: SecurityRequest): SecurityAnomaly | null {
    // 疑わしいエンドポイントパターン
    const suspiciousPatterns = [
      '/admin',
      '/config',
      '/debug',
      '/.env',
      '/backup',
      'sql',
      'script',
      'eval'
    ];

    const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
      request.endpoint.toLowerCase().includes(pattern.toLowerCase())
    );

    if (hasSuspiciousPattern) {
      return {
        type: 'SUSPICIOUS_PATTERN',
        severity: 'HIGH',
        message: `疑わしいアクセスパターン検知: ${request.endpoint}`,
        request
      };
    }

    return null;
  }

  private checkUserAgentAnomaly(request: SecurityRequest): SecurityAnomaly | null {
    if (!request.userAgent) {
      return {
        type: 'INVALID_USER_AGENT',
        severity: 'MEDIUM',
        message: 'User-Agentが設定されていません',
        request
      };
    }

    const hasBlockedAgent = this.config.blockedUserAgents.some(blocked => 
      request.userAgent!.toLowerCase().includes(blocked.toLowerCase())
    );

    if (hasBlockedAgent) {
      return {
        type: 'INVALID_USER_AGENT',
        severity: 'HIGH',
        message: `ブロック対象のUser-Agent: ${request.userAgent}`,
        request
      };
    }

    return null;
  }

  private isIPInCIDR(ip: string, cidr: string): boolean {
    // 簡易的なCIDR判定実装
    // 本番環境では、より厳密な実装を使用
    const [network, prefixLength] = cidr.split('/');
    const prefix = parseInt(prefixLength);
    
    try {
      const ipParts = ip.split('.').map(Number);
      const networkParts = network.split('.').map(Number);
      
      const ipInt = (ipParts[0] << 24) + (ipParts[1] << 16) + (ipParts[2] << 8) + ipParts[3];
      const networkInt = (networkParts[0] << 24) + (networkParts[1] << 16) + (networkParts[2] << 8) + networkParts[3];
      const mask = (-1 << (32 - prefix)) >>> 0;
      
      return (ipInt & mask) === (networkInt & mask);
    } catch {
      return false;
    }
  }

  private sendAlert(anomaly: SecurityAnomaly): void {
    // 登録されたコールバックを実行
    this.alertCallbacks.forEach(callback => {
      try {
        callback(anomaly);
      } catch (error) {
        console.error('Alert callback error:', error);
      }
    });

    // ログ出力
    console.warn(`[SecurityAlert] ${anomaly.severity}: ${anomaly.message}`, {
      type: anomaly.type,
      request: anomaly.request,
      timestamp: new Date().toISOString()
    });

    // Slack/Discord等への通知（環境変数で設定）
    if (process.env.SECURITY_WEBHOOK_URL) {
      this.sendWebhookAlert(anomaly);
    }
  }

  private async sendWebhookAlert(anomaly: SecurityAnomaly): Promise<void> {
    try {
      const payload = {
        text: `🚨 MATURA Security Alert`,
        attachments: [
          {
            color: anomaly.severity === 'CRITICAL' ? 'danger' : 'warning',
            fields: [
              { title: 'Type', value: anomaly.type, short: true },
              { title: 'Severity', value: anomaly.severity, short: true },
              { title: 'Message', value: anomaly.message, short: false },
              { title: 'IP', value: anomaly.request.ip, short: true },
              { title: 'Endpoint', value: anomaly.request.endpoint, short: true },
              { title: 'Time', value: new Date(anomaly.request.timestamp).toLocaleString(), short: true }
            ]
          }
        ]
      };

      await fetch(process.env.SECURITY_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Failed to send webhook alert:', error);
    }
  }

  onAlert(callback: (anomaly: SecurityAnomaly) => void): void {
    this.alertCallbacks.push(callback);
  }

  updateConfig(config: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  clearHistory(): void {
    this.requestHistory.clear();
  }
}