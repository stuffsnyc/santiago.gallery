/**
 * Image optimization utilities for modern format support
 */

// Feature detection cache
let webpSupported: boolean | null = null;
let avifSupported: boolean | null = null;

/**
 * Detect browser support for WebP format
 */
export function supportsWebP(): boolean {
  if (webpSupported !== null) return webpSupported;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  } catch {
    webpSupported = false;
  }
  
  return webpSupported;
}

/**
 * Detect browser support for AVIF format
 */
export function supportsAVIF(): boolean {
  if (avifSupported !== null) return avifSupported;
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    avifSupported = canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  } catch {
    avifSupported = false;
  }
  
  return avifSupported;
}

/**
 * Image source configuration for different formats
 */
export interface ImageSource {
  src: string;
  type: string;
  format: 'avif' | 'webp' | 'original';
}

/**
 * Transform a Shopify image URL to support modern formats
 */
export function getOptimizedShopifyImageUrl(
  originalUrl: string, 
  options: {
    width?: number;
    height?: number;
    format?: 'avif' | 'webp' | 'jpg' | 'png';
    quality?: number;
  } = {}
): string {
  if (!originalUrl || !originalUrl.includes('shopify.com')) {
    return originalUrl;
  }

  try {
    const url = new URL(originalUrl);
    
    // Apply transformations as URL parameters
    if (options.width) {
      url.searchParams.set('width', options.width.toString());
    }
    
    if (options.height) {
      url.searchParams.set('height', options.height.toString());
    }
    
    if (options.format) {
      // For Shopify, we can modify the file extension
      const pathname = url.pathname;
      const newPathname = pathname.replace(/\.(jpg|jpeg|png|webp|avif)$/i, `.${options.format}`);
      url.pathname = newPathname;
    }
    
    if (options.quality) {
      url.searchParams.set('quality', options.quality.toString());
    }
    
    return url.toString();
  } catch {
    return originalUrl;
  }
}

/**
 * Generate multiple image sources for different formats
 */
export function generateImageSources(
  originalUrl: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
  } = {}
): ImageSource[] {
  if (!originalUrl) {
    return [{ src: originalUrl, type: '', format: 'original' }];
  }

  const sources: ImageSource[] = [];
  
  // Add AVIF source if supported
  if (supportsAVIF()) {
    sources.push({
      src: getOptimizedShopifyImageUrl(originalUrl, { ...options, format: 'avif' }),
      type: 'image/avif',
      format: 'avif'
    });
  }
  
  // Add WebP source if supported
  if (supportsWebP()) {
    sources.push({
      src: getOptimizedShopifyImageUrl(originalUrl, { ...options, format: 'webp' }),
      type: 'image/webp',
      format: 'webp'
    });
  }
  
  // Add original as fallback
  sources.push({
    src: originalUrl,
    type: '',
    format: 'original'
  });
  
  return sources;
}

/**
 * Preload critical images with modern format support
 */
export function preloadImage(url: string, options: { priority?: boolean } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const sources = generateImageSources(url);
    const primarySource = sources[0]; // Use the most optimized format available
    
    const img = new Image();
    
    img.onload = () => resolve();
    img.onerror = () => {
      // Try next format if available
      if (sources.length > 1) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve();
        fallbackImg.onerror = () => reject(new Error(`Failed to load image: ${url}`));
        fallbackImg.src = sources[1].src;
      } else {
        reject(new Error(`Failed to load image: ${url}`));
      }
    };
    
    img.src = primarySource.src;
    
    // Set loading priority if specified
    if (options.priority && 'loading' in img) {
      (img as any).loading = 'eager';
    }
  });
}

/**
 * Get the best image format URL for the current browser
 */
export function getBestImageFormat(originalUrl: string, options: {
  width?: number;
  height?: number;
  quality?: number;
} = {}): string {
  const sources = generateImageSources(originalUrl, options);
  return sources[0].src; // Return the most optimized format available
}

/**
 * Image loading performance metrics
 */
export class ImagePerformanceMonitor {
  private static metrics: Map<string, { loadTime: number; format: string; size?: number }> = new Map();
  
  static recordImageLoad(url: string, format: string, startTime: number, size?: number) {
    const loadTime = performance.now() - startTime;
    this.metrics.set(url, { loadTime, format, size });
  }
  
  static getMetrics(): Array<{ url: string; loadTime: number; format: string; size?: number }> {
    return Array.from(this.metrics.entries()).map(([url, metrics]) => ({
      url,
      ...metrics
    }));
  }
  
  static getAverageLoadTime(): number {
    const times = Array.from(this.metrics.values()).map(m => m.loadTime);
    return times.length > 0 ? times.reduce((a, b) => a + b, 0) / times.length : 0;
  }
  
  static clearMetrics() {
    this.metrics.clear();
  }
}