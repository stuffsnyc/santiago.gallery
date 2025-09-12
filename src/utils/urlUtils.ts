// Utility functions for handling product URLs and navigation

/**
 * Generates a URL-friendly slug from a product title
 */
export function generateProductSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Creates a product URL with search parameters
 */
export function createProductUrl(productHandle: string, searchTerm?: string): string {
  const params = new URLSearchParams();
  params.set('product', productHandle);
  
  if (searchTerm && searchTerm.trim()) {
    params.set('search', encodeURIComponent(searchTerm));
  }
  
  return `${window.location.pathname}?${params.toString()}`;
}

/**
 * Creates a shareable product URL (full URL for sharing)
 */
export function createShareableProductUrl(productHandle: string, searchTerm?: string): string {
  const params = new URLSearchParams();
  params.set('product', productHandle);
  
  if (searchTerm && searchTerm.trim()) {
    params.set('search', encodeURIComponent(searchTerm));
  }
  
  return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
}

/**
 * Extracts product handle and search term from current URL
 */
export function parseCurrentUrl(): { productHandle: string | null; searchTerm: string | null } {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    productHandle: urlParams.get('product'),
    searchTerm: urlParams.get('search') ? decodeURIComponent(urlParams.get('search')!) : null
  };
}

/**
 * Updates the browser URL without triggering a page reload
 */
export function updateUrl(productHandle?: string, searchTerm?: string, replace: boolean = false): void {
  const currentParams = new URLSearchParams(window.location.search);
  
  if (productHandle) {
    currentParams.set('product', productHandle);
  } else {
    currentParams.delete('product');
  }
  
  if (searchTerm && searchTerm.trim()) {
    currentParams.set('search', encodeURIComponent(searchTerm));
  } else {
    currentParams.delete('search');
  }
  
  const newUrl = currentParams.toString() 
    ? `${window.location.pathname}?${currentParams.toString()}`
    : window.location.pathname;
  
  if (replace) {
    window.history.replaceState(null, '', newUrl);
  } else {
    window.history.pushState(null, '', newUrl);
  }
}