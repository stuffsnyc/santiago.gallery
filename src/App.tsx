import { useState, useEffect, useMemo, useRef } from 'react';
import { ShopifyProduct } from './types/shopify';
import { fetchProducts } from './services/shopify';
import { CatalogHeader } from './components/CatalogHeader';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailPopup } from './components/ProductDetailPopup';
import { Footer } from './components/Footer';
import { GDPRCookieConsent } from './components/GDPRCookieConsent';
import { GalaxyBackground } from './components/GalaxyBackground';
import { ThemeProvider } from './components/ThemeProvider';
import { Alert, AlertDescription } from './components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { preloadImage } from './utils/imageOptimization';

export default function App() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPageFullyLoaded, setIsPageFullyLoaded] = useState(false);

  const [selectedCollection, setSelectedCollection] = useState('all');
  const [selectedVendor, setSelectedVendor] = useState('POSTERS');
  const [selectedDateSort, setSelectedDateSort] = useState('random');
  const [searchTerm, setSearchTerm] = useState('');
  const [randomSeed, setRandomSeed] = useState(Math.random());
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Pagination state
  const [displayedCount, setDisplayedCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const PRODUCTS_PER_PAGE = 4;

  // Load galaxy background only after page is fully loaded for better FCP
  useEffect(() => {
    const handleLoad = () => {
      // Add a small delay to ensure all critical content has rendered
      setTimeout(() => {
        setIsPageFullyLoaded(true);
      }, 100);
    };

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  // URL handling with refs to avoid infinite loops
  const isUpdatingFromUrlRef = useRef(false);
  const urlProductHandleRef = useRef<string | null>(null);

  // Store the product handle from URL on app init
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productHandle = urlParams.get('product');
    if (productHandle) {
      console.log('🚀 App initialized with product URL:', productHandle);
      urlProductHandleRef.current = productHandle;
    }
  }, []);

  // Handle browser navigation (back/forward) 
  useEffect(() => {
    const handlePopState = () => {
      if (products.length === 0) return;
      
      isUpdatingFromUrlRef.current = true;
      
      const urlParams = new URLSearchParams(window.location.search);
      const productHandle = urlParams.get('product');
      const searchParam = urlParams.get('search');
      
      console.log('🏠 Navigation event - Product handle:', productHandle);
      
      // Handle product popup from URL
      if (productHandle) {
        // Try to find the product
        let product = products.find(p => p.handle === productHandle);
        
        if (!product) {
          product = products.find(p => p.handle.toLowerCase() === productHandle.toLowerCase());
        }
        
        if (product) {
          console.log('✅ Found product for navigation:', product.title);
          setSelectedProduct(product);
          setIsPopupOpen(true);
        } else {
          console.warn('❌ Product not found during navigation:', productHandle);
        }
      } else {
        console.log('📖 Closing popup - no product in URL');
        setIsPopupOpen(false);
        setSelectedProduct(null);
      }
      
      // Handle search term from URL
      const decodedSearch = searchParam ? decodeURIComponent(searchParam) : '';
      setSearchTerm(decodedSearch);
      
      // Reset flag after state updates are processed
      setTimeout(() => {
        isUpdatingFromUrlRef.current = false;
      }, 0);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [products.length]);

  // Simplified URL product handling - runs whenever products change
  useEffect(() => {
    // Skip if no products loaded yet or no product handle in URL
    if (products.length === 0 || !urlProductHandleRef.current) return;
    
    // Skip if popup is already open (product already found and opened)
    if (isPopupOpen) return;
    
    const productHandle = urlProductHandleRef.current;
    console.log(`🔗 Checking for product "${productHandle}" in ${products.length} loaded products`);
    
    // Try to find the product with multiple matching strategies
    let product = products.find(p => p.handle === productHandle); // Exact match
    
    if (!product) {
      product = products.find(p => p.handle.toLowerCase() === productHandle.toLowerCase()); // Case-insensitive
    }
    
    if (!product) {
      product = products.find(p => p.handle.includes(productHandle) || productHandle.includes(p.handle)); // Partial match
    }
    
    if (product) {
      console.log('✅ Found product from URL:', product.title, 'handle:', product.handle);
      isUpdatingFromUrlRef.current = true;
      setSelectedProduct(product);
      setIsPopupOpen(true);
      // Clear the URL product handle since we found it
      urlProductHandleRef.current = null;
      
      // Reset flag after state updates
      setTimeout(() => {
        isUpdatingFromUrlRef.current = false;
      }, 0);
    } else {
      console.warn(`❌ Product "${productHandle}" not found in ${products.length} products`);
      console.log('📋 Available handles:', products.map(p => p.handle).slice(0, 10));
    }
  }, [products.length, isPopupOpen]);

  // Handle search term from URL (run once when app loads)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
      const decodedSearch = decodeURIComponent(searchParam);
      setSearchTerm(decodedSearch);
      console.log('🔍 Set search term from URL:', decodedSearch);
    }
  }, []);

  // Update URL when search term changes (only if not updating from URL)
  useEffect(() => {
    if (isUpdatingFromUrlRef.current) return;
    
    const currentParams = new URLSearchParams(window.location.search);
    const currentSearch = currentParams.get('search');
    
    if (searchTerm && searchTerm !== currentSearch) {
      currentParams.set('search', encodeURIComponent(searchTerm));
    } else if (!searchTerm && currentSearch) {
      currentParams.delete('search');
    } else {
      return; // No change needed
    }
    
    const newUrl = currentParams.toString() 
      ? `${window.location.pathname}?${currentParams.toString()}`
      : window.location.pathname;
      
    window.history.replaceState(null, '', newUrl);
  }, [searchTerm]);

  // Update URL when popup opens/closes (only if not updating from URL)
  useEffect(() => {
    if (isUpdatingFromUrlRef.current) return;
    
    const currentParams = new URLSearchParams(window.location.search);
    const currentProduct = currentParams.get('product');
    
    if (isPopupOpen && selectedProduct) {
      // Add product to URL when popup opens
      if (currentProduct !== selectedProduct.handle) {
        currentParams.set('product', selectedProduct.handle);
        const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
        window.history.pushState({ product: selectedProduct.handle }, '', newUrl);
      }
    } else if (!isPopupOpen && currentProduct) {
      // Remove product from URL when popup closes
      currentParams.delete('product');
      const newUrl = currentParams.toString() 
        ? `${window.location.pathname}?${currentParams.toString()}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  }, [isPopupOpen, selectedProduct]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('🛍️ Loading initial products...');
        
        // Start with fewer products for faster initial load
        const response = await fetchProducts(20); 
        const productList = response.data.products.edges.map(edge => edge.node);
        setProducts(productList);
        
        console.log('✅ Initial products loaded:', productList.length);
        
        // Preload first few product images for better performance
        const priorityImages = productList.slice(0, 4)
          .map(product => product.images.edges[0]?.node?.url)
          .filter(Boolean);
        
        // Preload critical images in background
        priorityImages.forEach(async (imageUrl, index) => {
          try {
            await preloadImage(imageUrl, { priority: index < 2 });
          } catch (error) {
            console.debug('Failed to preload image:', imageUrl, error);
          }
        });
        
        // Lazy load additional products in background for better filtering
        setTimeout(async () => {
          try {
            console.log('🔄 Loading additional products...');
            const additionalResponse = await fetchProducts(50);
            const allProductsList = additionalResponse.data.products.edges.map(edge => edge.node);
            setProducts(allProductsList);
            console.log('✅ All products loaded:', allProductsList.length);
          } catch (error) {
            console.debug('Failed to load additional products:', error);
          }
        }, 500);
        
      } catch (err) {
        console.error('❌ Failed to load products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const collections = useMemo(() => {
    const collectionSet = new Set<string>();
    products.forEach(product => {
      if (product.collections?.edges) {
        product.collections.edges.forEach(({ node: collection }) => {
          if (collection?.title && collection.title.trim()) {
            collectionSet.add(collection.title);
          }
        });
      }
    });
    return Array.from(collectionSet).sort();
  }, [products]);

  const vendors = useMemo(() => {
    const vendorSet = new Set<string>();
    products.forEach(product => {
      if (product.vendor && product.vendor.trim()) {
        vendorSet.add(product.vendor);
      }
    });
    return Array.from(vendorSet).sort();
  }, [products]);

  // Fisher-Yates shuffle algorithm with seeded random
  const shuffleArray = (array: ShopifyProduct[], seed: number) => {
    const shuffled = [...array];
    
    // Simple seeded random number generator
    let randomSeed = seed;
    const seededRandom = () => {
      randomSeed = (randomSeed * 9301 + 49297) % 233280;
      return randomSeed / 233280;
    };
    
    // Fisher-Yates shuffle
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product => {
        const titleMatch = product.title.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower) || false;
        const vendorMatch = product.vendor?.toLowerCase().includes(searchLower) || false;
        const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(searchLower)) || false;
        const collectionMatch = product.collections?.edges?.some(
          ({ node }) => node?.title?.toLowerCase().includes(searchLower)
        ) || false;
        
        return titleMatch || descriptionMatch || vendorMatch || tagMatch || collectionMatch;
      });
    }
    
    // Filter by collection
    if (selectedCollection && selectedCollection !== 'all') {
      filtered = filtered.filter(product => 
        (product.collections?.edges || []).some(({ node }) => node?.title === selectedCollection)
      );
    }

    // Filter by vendor/brand
    if (selectedVendor && selectedVendor !== 'all') {
      filtered = filtered.filter(product => product.vendor === selectedVendor);
    }

    // Sort by date or shuffle
    if (selectedDateSort !== 'none') {
      if (selectedDateSort === 'random') {
        // Use Fisher-Yates shuffle with seeded random for consistent results
        filtered = shuffleArray(filtered, randomSeed * 1000);
      } else {
        filtered = [...filtered].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          
          if (selectedDateSort === 'new-to-old') {
            return dateB - dateA; // Newest first
          } else {
            return dateA - dateB; // Oldest first
          }
        });
      }
    }
    
    return filtered;
  }, [products, searchTerm, selectedCollection, selectedVendor, selectedDateSort, randomSeed]);

  // Get only the products to display on current page
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, displayedCount);
  }, [filteredProducts, displayedCount]);

  // Check if there are more products to load
  const hasMoreProducts = filteredProducts.length > displayedCount;

  // Load more products function
  const handleLoadMore = () => {
    if (isLoadingMore || !hasMoreProducts) return;
    
    setIsLoadingMore(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount(prev => prev + PRODUCTS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300);
  };

  // Auto-load more products when scrolling near bottom
  useEffect(() => {
    const handleScroll = () => {
      // Check if we're near the bottom of the page (within 500px of footer)
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // If we're within 500px of the bottom and have more products to load
      if (distanceFromBottom < 500 && hasMoreProducts && !isLoadingMore && !isLoading) {
        handleLoadMore();
      }
    };

    // Add scroll listener with throttling
    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [hasMoreProducts, isLoadingMore, isLoading]);

  // Reset displayed count when filters change and generate new random seed for random sort
  useEffect(() => {
    setDisplayedCount(PRODUCTS_PER_PAGE);
    // Generate new random seed when switching to random order
    if (selectedDateSort === 'random') {
      setRandomSeed(Math.random());
    }
  }, [searchTerm, selectedCollection, selectedVendor, selectedDateSort]);

  const handleProductClick = (product: ShopifyProduct) => {
    // URL will be updated by the useEffect that watches isPopupOpen/selectedProduct
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    // Check if we need to navigate back or just close
    const currentParams = new URLSearchParams(window.location.search);
    const hasProductInUrl = currentParams.has('product');
    
    if (hasProductInUrl) {
      // Use browser back navigation to properly handle history
      window.history.back();
    } else {
      // Direct close without URL change
      setIsPopupOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="product-catalog-theme">
      <div className="min-h-screen bg-background relative">
        {/* Galaxy Background - Load only after page is fully loaded for better FCP */}
        {isPageFullyLoaded && <GalaxyBackground />}
        
        {/* Main Content - positioned above background */}
        <div className="relative z-10">
          <CatalogHeader
            productCount={filteredProducts.length}
            collections={collections}
            vendors={vendors}
            selectedCollection={selectedCollection}
            selectedVendor={selectedVendor}
            selectedDateSort={selectedDateSort}
            searchTerm={searchTerm}
            onCollectionChange={setSelectedCollection}
            onVendorChange={setSelectedVendor}
            onDateSortChange={setSelectedDateSort}
            onSearchChange={setSearchTerm}
          />
          
          <main className="container mx-auto px-4 py-8">
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <ProductGrid 
                products={displayedProducts} 
                isLoading={isLoading} 
                onProductClick={handleProductClick}
                hasMoreProducts={hasMoreProducts}
                isLoadingMore={isLoadingMore}
              />
            )}
          </main>

          {/* Product Detail Popup */}
          {selectedProduct && (
            <ProductDetailPopup
              product={selectedProduct}
              allProducts={products}
              isOpen={isPopupOpen}
              onClose={handleClosePopup}
            />
          )}

          {/* Footer */}
          <Footer />
          
          {/* GDPR Cookie Consent Banner */}
          <GDPRCookieConsent />
          
          {/* Toast Notifications */}
          <Toaster />
        </div>
      </div>
    </ThemeProvider>
  );
}