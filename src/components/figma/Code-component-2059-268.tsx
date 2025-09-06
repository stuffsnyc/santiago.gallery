import React, { useState, useMemo, useRef } from 'react'
import { generateImageSources, ImagePerformanceMonitor } from '../../utils/imageOptimization'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  optimizationOptions?: {
    width?: number;
    height?: number;
    quality?: number;
  };
  enablePerformanceMonitoring?: boolean;
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const loadStartTime = useRef<number>(0)

  const { 
    src, 
    alt, 
    style, 
    className, 
    optimizationOptions = {}, 
    enablePerformanceMonitoring = true,
    ...rest 
  } = props

  // Generate optimized image sources
  const imageSources = useMemo(() => 
    generateImageSources(src || '', optimizationOptions), 
    [src, optimizationOptions]
  );
  
  const handleError = () => {
    // Try next source format if available
    if (currentSourceIndex < imageSources.length - 1) {
      setCurrentSourceIndex(prev => prev + 1);
    } else {
      // All sources failed, show error state
      setDidError(true);
    }
  }

  const handleLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    // Reset error state if image loads successfully
    setDidError(false);
    
    // Record performance metrics if enabled
    if (enablePerformanceMonitoring && loadStartTime.current > 0) {
      const currentSource = imageSources[currentSourceIndex];
      if (currentSource) {
        ImagePerformanceMonitor.recordImageLoad(
          src || '', 
          currentSource.format, 
          loadStartTime.current,
          // Try to get file size from response headers if available
          undefined
        );
      }
    }
  }

  const handleLoadStart = () => {
    if (enablePerformanceMonitoring) {
      loadStartTime.current = performance.now();
    }
  }

  // Reset source index when src changes
  React.useEffect(() => {
    setCurrentSourceIndex(0);
    setDidError(false);
  }, [src]);

  const currentImageSource = imageSources[currentSourceIndex];

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img 
          src={ERROR_IMG_SRC} 
          alt="Error loading image" 
          {...rest} 
          data-original-url={src}
          data-attempted-sources={JSON.stringify(imageSources.map(s => s.src))}
        />
      </div>
    </div>
  ) : (
    <>
      {/* Use picture element for progressive enhancement */}
      <picture>
        {/* Add source elements for modern formats (excluding the fallback) */}
        {imageSources.slice(0, -1).map((source, index) => (
          <source 
            key={`${source.format}-${index}`}
            srcSet={source.src}
            type={source.type}
          />
        ))}
        <img 
          src={currentImageSource?.src || src} 
          alt={alt} 
          className={className} 
          style={style} 
          {...rest} 
          onError={handleError}
          onLoad={handleLoad}
          onLoadStart={handleLoadStart}
          loading={rest.loading || 'lazy'}
          decoding={rest.decoding || 'async'}
          data-format={currentImageSource?.format || 'original'}
          data-source-index={currentSourceIndex}
          data-optimized={imageSources.length > 1 ? 'true' : 'false'}
        />
      </picture>
    </>
  )
}
