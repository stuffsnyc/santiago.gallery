import React, { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ImagePerformanceMonitor } from '../utils/imageOptimization';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { BarChart3, Image as ImageIcon, Download, Clock } from 'lucide-react';

/**
 * Demo component to showcase image optimization features
 */
export function ImageOptimizationDemo() {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [showDemo, setShowDemo] = useState(false);

  // Sample Shopify image URL for testing
  const testImageUrl = "https://cdn.shopify.com/s/files/1/0123/4567/products/sample-product.jpg?v=1234567890";

  useEffect(() => {
    if (showDemo) {
      // Update metrics every 2 seconds when demo is active
      const interval = setInterval(() => {
        setMetrics(ImagePerformanceMonitor.getMetrics());
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [showDemo]);

  const averageLoadTime = ImagePerformanceMonitor.getAverageLoadTime();

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Image Optimization Demo
          </CardTitle>
          <CardDescription>
            Demonstration of AVIF/WebP image format optimization with performance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={() => setShowDemo(!showDemo)}
              variant={showDemo ? "destructive" : "default"}
            >
              {showDemo ? "Stop Demo" : "Start Demo"}
            </Button>
            <Button 
              onClick={() => {
                ImagePerformanceMonitor.clearMetrics();
                setMetrics([]);
              }}
              variant="outline"
            >
              Clear Metrics
            </Button>
          </div>

          {showDemo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Original format */}
              <div className="space-y-2">
                <h4 className="font-medium">Original Format</h4>
                <ImageWithFallback
                  src={testImageUrl}
                  alt="Original format test"
                  className="w-full h-32 object-cover rounded"
                  optimizationOptions={{
                    width: 200,
                    height: 128,
                    quality: 80
                  }}
                  enablePerformanceMonitoring={true}
                />
                <Badge variant="secondary">No optimization</Badge>
              </div>

              {/* WebP optimized */}
              <div className="space-y-2">
                <h4 className="font-medium">WebP Optimized</h4>
                <ImageWithFallback
                  src={testImageUrl}
                  alt="WebP optimized test"
                  className="w-full h-32 object-cover rounded"
                  optimizationOptions={{
                    width: 200,
                    height: 128,
                    quality: 85
                  }}
                  enablePerformanceMonitoring={true}
                />
                <Badge variant="default">WebP + AVIF</Badge>
              </div>

              {/* High quality */}
              <div className="space-y-2">
                <h4 className="font-medium">High Quality</h4>
                <ImageWithFallback
                  src={testImageUrl}
                  alt="High quality test"
                  className="w-full h-32 object-cover rounded"
                  optimizationOptions={{
                    width: 400,
                    height: 256,
                    quality: 95
                  }}
                  enablePerformanceMonitoring={true}
                />
                <Badge variant="outline">High res</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      {metrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>
              Real-time image loading performance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">Average Load Time:</span>
                  <Badge variant="secondary">{averageLoadTime.toFixed(2)}ms</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span className="font-medium">Total Images:</span>
                  <Badge variant="outline">{metrics.length}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Individual Image Performance:</h4>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {metrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {metric.format || 'original'}
                        </Badge>
                        <span className="text-sm truncate max-w-40">
                          Image {index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">
                          {metric.loadTime.toFixed(2)}ms
                        </span>
                        {metric.size && (
                          <Badge variant="secondary" className="text-xs">
                            {(metric.size / 1024).toFixed(1)}KB
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Format Support Information */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Support Information</CardTitle>
          <CardDescription>
            Current browser capabilities for modern image formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 rounded border">
              <span className="font-medium">AVIF Support</span>
              <Badge variant={typeof window !== 'undefined' && 
                (() => {
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1;
                    canvas.height = 1;
                    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
                  } catch {
                    return false;
                  }
                })() ? "default" : "destructive"}>
                {typeof window !== 'undefined' && 
                  (() => {
                    try {
                      const canvas = document.createElement('canvas');
                      canvas.width = 1;
                      canvas.height = 1;
                      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0 ? "Supported" : "Not Supported";
                    } catch {
                      return "Not Supported";
                    }
                  })()
                }
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded border">
              <span className="font-medium">WebP Support</span>
              <Badge variant={typeof window !== 'undefined' && 
                (() => {
                  try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1;
                    canvas.height = 1;
                    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
                  } catch {
                    return false;
                  }
                })() ? "default" : "secondary"}>
                {typeof window !== 'undefined' && 
                  (() => {
                    try {
                      const canvas = document.createElement('canvas');
                      canvas.width = 1;
                      canvas.height = 1;
                      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? "Supported" : "Not Supported";
                    } catch {
                      return "Not Supported";
                    }
                  })()
                }
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}