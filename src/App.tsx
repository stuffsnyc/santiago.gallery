import { useState, useEffect, useMemo } from 'react';
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

  // Handle URL hash for search anchors
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1); // Remove the # symbol
      if (hash) {
        setSearchTerm(decodeURIComponent(hash));
      }
    };

    // Check hash on initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Update URL hash when search term changes
  useEffect(() => {
    if (searchTerm) {
      // Update URL hash without triggering a page reload
      const newHash = `#${encodeURIComponent(searchTerm)}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } else {
      // Remove hash if search is empty
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [searchTerm]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Start with fewer products for faster initial load
        const response = await fetchProducts(20); 
        const productList = response.data.products.edges.map(edge => edge.node);
        setProducts(productList);
        
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
            const additionalResponse = await fetchProducts(50);
            const allProductsList = additionalResponse.data.products.edges.map(edge => edge.node);
            setProducts(allProductsList);
          } catch (error) {
            console.debug('Failed to load additional products:', error);
          }
        }, 500);
        
      } catch (err) {
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
    setSelectedProduct(product);
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedProduct(null);
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