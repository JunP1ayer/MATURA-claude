'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, Palette } from 'lucide-react'

interface FigmaTestResult {
  success: boolean
  data?: any
  error?: string
  timestamp: string
}

export default function FigmaIntegrationTest() {
  const [figmaFileId, setFigmaFileId] = useState('GeCGXZi0K7PqpHmzXjZkWn')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<FigmaTestResult | null>(null)

  const testFigmaIntegration = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log('🔧 Testing Figma integration with file ID:', figmaFileId)
      
      const response = await fetch('/api/figma', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fileId: figmaFileId
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          success: true,
          data: data.data,
          timestamp: new Date().toISOString()
        })
      } else {
        setResult({
          success: false,
          error: data.error || 'Unknown error occurred',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Network error occurred',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testGenerationWithFigma = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      console.log('🔧 Testing full generation with Figma integration')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userInput: 'Create a beautiful task management app with modern design',
          figmaFileId: figmaFileId
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({
          success: true,
          data: data,
          timestamp: new Date().toISOString()
        })
      } else {
        setResult({
          success: false,
          error: data.error || 'Generation failed',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message || 'Network error occurred',
        timestamp: new Date().toISOString()
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-500" />
            Figma Integration Test Tool
          </CardTitle>
          <CardDescription>
            Test the Figma API integration and app generation with design system data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="figmaFileId">Figma File ID</Label>
            <Input
              id="figmaFileId"
              value={figmaFileId}
              onChange={(e) => setFigmaFileId(e.target.value)}
              placeholder="Enter Figma file ID"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Default: GeCGXZi0K7PqpHmzXjZkWn (template file)
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={testFigmaIntegration}
              disabled={isLoading || !figmaFileId}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Figma API'
              )}
            </Button>

            <Button
              onClick={testGenerationWithFigma}
              disabled={isLoading || !figmaFileId}
              variant="outline"
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Test Full Generation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              Test Result
            </CardTitle>
            <CardDescription>
              {result.timestamp}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.success ? (
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    ✅ Test completed successfully!
                  </AlertDescription>
                </Alert>

                {result.data && (
                  <div className="space-y-4">
                    {/* Figma file data */}
                    {result.data.file && (
                      <div>
                        <h4 className="font-semibold mb-2">Figma File Info</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Name:</span> {result.data.file.name}
                          </div>
                          <div>
                            <span className="font-medium">Last Modified:</span>{' '}
                            {new Date(result.data.file.lastModified).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Design system */}
                    {result.data.designSystem && (
                      <div>
                        <h4 className="font-semibold mb-2">Design System</h4>
                        <div className="space-y-2">
                          <div>
                            <span className="font-medium">Colors:</span>
                            <div className="flex gap-2 mt-1">
                              {result.data.designSystem.colors.slice(0, 8).map((color: string, index: number) => (
                                <div
                                  key={index}
                                  className="w-6 h-6 rounded border border-gray-300"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Fonts:</span>
                            <div className="flex gap-2 mt-1">
                              {result.data.designSystem.fonts.slice(0, 5).map((font: string, index: number) => (
                                <Badge key={index} variant="outline">
                                  {font}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Components:</span>{' '}
                            {result.data.designSystem.components.length} found
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generation result */}
                    {result.data.result && (
                      <div>
                        <h4 className="font-semibold mb-2">Generation Result</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Method:</span>{' '}
                            <Badge>{result.data.result.generationMethod || 'unknown'}</Badge>
                          </div>
                          <div>
                            <span className="font-medium">App Type:</span> {result.data.result.appType}
                          </div>
                          <div>
                            <span className="font-medium">Features:</span>{' '}
                            {result.data.result.features?.join(', ') || 'N/A'}
                          </div>
                          <div>
                            <span className="font-medium">Figma Integrated:</span>{' '}
                            <Badge variant={result.data.result.figmaIntegrated ? 'default' : 'secondary'}>
                              {result.data.result.figmaIntegrated ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                          {result.data.result.figmaData && (
                            <div>
                              <span className="font-medium">Figma Data Used:</span>
                              <ul className="ml-4 mt-1 text-xs text-gray-600">
                                <li>• Colors: {result.data.result.figmaData.colorsUsed?.join(', ')}</li>
                                <li>• Fonts: {result.data.result.figmaData.fontsUsed?.join(', ')}</li>
                                <li>• Components: {result.data.result.figmaData.componentsUsed}</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  ❌ Test failed: {result.error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}