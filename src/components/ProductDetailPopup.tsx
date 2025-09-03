import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { ShopifyProduct } from '../types/shopify';
import { X, ChevronLeft, ChevronRight, ShoppingCart, Plus, ChevronUp, ChevronDown, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { SpotifyMiniPlayer } from './SpotifyMiniPlayer';

interface ProductDetailPopupProps {
  product: ShopifyProduct;
  allProducts: ShopifyProduct[];
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailPopup({ product, allProducts, isOpen, onClose }: ProductDetailPopupProps) {
  const [currentProduct, setCurrentProduct] = useState(product);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isPlayerMinimized, setIsPlayerMinimized] = useState(true);
  const carouselScrollRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const touchStartX = useRef(0);
  const touchStartTime = useRef(0);
  const imageTouchStartX = useRef(0);
  const imageTouchStartTime = useRef(0);

  // Haptic feedback utility
  const triggerHapticFeedback = useCallback((pattern: number | number[] = 50) => {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch (error) {
        // Silently fail if vibration API is not supported or blocked
        console.debug('Haptic feedback not available:', error);
      }
    }
  }, []);

  // Memoize related products calculation
  const carouselProducts = useMemo(() => {
    const mainCollections = new Set(
      product.collections.edges.map(edge => edge.node.id)
    );
    
    const related = allProducts
      .filter(p => p.id !== product.id)
      .filter(p => 
        p.collections.edges.some(edge => mainCollections.has(edge.node.id))
      )
      .slice(0, 4); // Limit to 4 related products
    
    return [product, ...related];
  }, [product, allProducts]);

  // Memoize current product index
  const currentProductIndex = useMemo(() => {
    return carouselProducts.findIndex(p => p.id === currentProduct.id);
  }, [carouselProducts, currentProduct.id]);

  const getSharedCollectionNames = useCallback((product1: ShopifyProduct, product2: ShopifyProduct) => {
    const collections1 = new Set(product1.collections.edges.map(edge => edge.node.title));
    const collections2 = product2.collections.edges.map(edge => edge.node.title);
    return collections2.filter(title => collections1.has(title));
  }, []);

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  // Get selected variant details
  const selectedVariantNode = useMemo(() => {
    return currentProduct.variants.edges.find(edge => edge.node.id === selectedVariant)?.node;
  }, [currentProduct.variants.edges, selectedVariant]);

  // Map currentVariant for the new structure
  const currentVariant = selectedVariantNode;

  // Get current price based on selected variant
  const currentPrice = useMemo(() => {
    if (selectedVariantNode) {
      return formatPrice(selectedVariantNode.price.amount, selectedVariantNode.price.currencyCode);
    }
    return formatPrice(
      currentProduct.priceRange.minVariantPrice.amount,
      currentProduct.priceRange.minVariantPrice.currencyCode
    );
  }, [selectedVariantNode, currentProduct.priceRange.minVariantPrice, formatPrice]);

  const goToProduct = useCallback((index: number) => {
    const targetProduct = carouselProducts[index];
    setCurrentProduct(targetProduct);
    setCurrentImageIndex(0);
    setSelectedVariant('');
    
    // Scroll to the product without triggering scroll events
    if (carouselScrollRef.current) {
      const container = carouselScrollRef.current;
      const targetScrollLeft = index * container.clientWidth;
      setIsScrolling(true);
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth'
      });
      
      // Reset scrolling flag after animation
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  }, [carouselProducts]);

  const nextProduct = useCallback(() => {
    if (currentProductIndex < carouselProducts.length - 1) {
      triggerHapticFeedback([100, 50]); // Double tap pattern for product navigation
      goToProduct(currentProductIndex + 1);
    } else {
      triggerHapticFeedback(30); // Light feedback at boundary
    }
  }, [currentProductIndex, carouselProducts.length, goToProduct, triggerHapticFeedback]);

  const prevProduct = useCallback(() => {
    if (currentProductIndex > 0) {
      triggerHapticFeedback([100, 50]); // Double tap pattern for product navigation
      goToProduct(currentProductIndex - 1);
    } else {
      triggerHapticFeedback(30); // Light feedback at boundary
    }
  }, [currentProductIndex, goToProduct, triggerHapticFeedback]);

  // Handle scroll events to detect product changes
  const handleCarouselScroll = useCallback(() => {
    if (isScrolling || !carouselScrollRef.current) return;
    
    const container = carouselScrollRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    
    // Calculate which product should be active based on scroll position
    const newProductIndex = Math.round(scrollLeft / containerWidth);
    
    // Only update if we've moved to a different product
    if (newProductIndex !== currentProductIndex && newProductIndex >= 0 && newProductIndex < carouselProducts.length) {
      const newProduct = carouselProducts[newProductIndex];
      setCurrentProduct(newProduct);
      setCurrentImageIndex(0);
      setSelectedVariant('');
    }
  }, [isScrolling, currentProductIndex, carouselProducts]);

  // Touch handlers for swipe navigation
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!carouselScrollRef.current) return;
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Allow default scrolling behavior
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!carouselScrollRef.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const deltaX = touchStartX.current - touchEndX;
    const deltaTime = touchEndTime - touchStartTime.current;
    
    // Check for swipe gesture (minimum distance and maximum time)
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      if (deltaX > 0 && currentProductIndex < carouselProducts.length - 1) {
        // Swipe left - next product
        triggerHapticFeedback([100, 50]); // Double tap pattern for product navigation
        goToProduct(currentProductIndex + 1);
      } else if (deltaX < 0 && currentProductIndex > 0) {
        // Swipe right - previous product
        triggerHapticFeedback([100, 50]); // Double tap pattern for product navigation
        goToProduct(currentProductIndex - 1);
      } else {
        // Invalid swipe (at boundaries) - light feedback
        triggerHapticFeedback(30);
      }
    }
  }, [currentProductIndex, carouselProducts.length, goToProduct, triggerHapticFeedback]);

  // Touch handlers for image swipe navigation
  const handleImageTouchStart = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent product carousel touch events
    imageTouchStartX.current = e.touches[0].clientX;
    imageTouchStartTime.current = Date.now();
  }, []);

  const handleImageTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation(); // Prevent product carousel touch events
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndTime = Date.now();
    const deltaX = imageTouchStartX.current - touchEndX;
    const deltaTime = touchEndTime - imageTouchStartTime.current;
    
    // Check for swipe gesture (minimum distance and maximum time)
    const minSwipeDistance = 50;
    const maxSwipeTime = 300;
    
    if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime && currentProduct.images.edges.length > 1) {
      // Single tap pattern for image navigation
      triggerHapticFeedback(75);
      
      if (deltaX > 0) {
        // Swipe left - next image
        setCurrentImageIndex(prev => 
          prev < currentProduct.images.edges.length - 1 ? prev + 1 : 0
        );
      } else {
        // Swipe right - previous image
        setCurrentImageIndex(prev => 
          prev > 0 ? prev - 1 : currentProduct.images.edges.length - 1
        );
      }
    } else if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
      // Invalid swipe (single image) - very light feedback
      triggerHapticFeedback(20);
    }
  }, [currentProduct.images.edges.length, triggerHapticFeedback]);

  const nextImage = () => {
    triggerHapticFeedback(75); // Haptic feedback for button click
    setCurrentImageIndex(prev => 
      prev < currentProduct.images.edges.length - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    triggerHapticFeedback(75); // Haptic feedback for button click
    setCurrentImageIndex(prev => 
      prev > 0 ? prev - 1 : currentProduct.images.edges.length - 1
    );
  };

  // Redirect to Shopify cart utility function
  const redirectToShopifyCart = (variantId: string, quantity: number) => {
    const cartUrl = `https://tndztv-yx.myshopify.com/cart/${variantId.split('/').pop()}:${quantity}`;
    window.open(cartUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (currentVariant) {
      redirectToShopifyCart(currentVariant.id, quantity);
    }
  };

  const handleBuyNow = () => {
    if (selectedVariantNode) {
      // Create Shopify checkout URL with selected variant
      const variantId = selectedVariantNode.id.split('/').pop();
      const checkoutUrl = `https://tndztv-yx.myshopify.com/checkout?variant=${variantId}&quantity=1`;
      window.open(checkoutUrl, '_blank');
    }
  };

  // Reset when popup opens or product changes
  useEffect(() => {
    setCurrentProduct(product);
    setCurrentImageIndex(0);
    setSelectedVariant('');
    setIsPlayerMinimized(true); // Reset player to minimized state
    
    // Scroll to the initial product position
    if (carouselScrollRef.current) {
      const initialIndex = carouselProducts.findIndex(p => p.id === product.id);
      if (initialIndex >= 0) {
        const container = carouselScrollRef.current;
        const targetScrollLeft = initialIndex * container.clientWidth;
        setIsScrolling(true);
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'auto'
        });
        
        setTimeout(() => {
          setIsScrolling(false);
        }, 100);
      }
    }
  }, [product.id, isOpen]); // Reset when product changes or popup opens

  // Set default variant
  useEffect(() => {
    if (currentProduct.variants.edges.length > 0 && !selectedVariant) {
      setSelectedVariant(currentProduct.variants.edges[0].node.id);
    }
  }, [currentProduct, selectedVariant]);

  // Add scroll event listener to carousel
  useEffect(() => {
    const container = carouselScrollRef.current;
    if (!container) return;

    // Add scroll event listener with throttling
    let scrollTimeout: NodeJS.Timeout;
    const throttledScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleCarouselScroll, 100);
    };

    container.addEventListener('scroll', throttledScrollHandler, { passive: true });
    
    return () => {
      container.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [handleCarouselScroll]);

  // Add keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          if (currentProductIndex > 0) {
            e.preventDefault();
            goToProduct(currentProductIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (currentProductIndex < carouselProducts.length - 1) {
            e.preventDefault();
            goToProduct(currentProductIndex + 1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, currentProductIndex, carouselProducts.length, goToProduct, onClose]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentImages = currentProduct.images.edges;
  const currentImage = currentImages[currentImageIndex]?.node;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative bg-card rounded-none sm:rounded-2xl shadow-2xl max-w-7xl w-full h-full sm:max-h-[90vh] flex flex-col border-0 sm:border border-border"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border shrink-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-card-foreground">{currentProduct.title}</h1>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-foreground text-[16px] font-normal"
          >
            <X className="w-[1.625rem] h-[1.625rem]" strokeWidth={3} />
          </button>
        </div>

        {/* Carousel Container */}
        <div className="flex-1 min-h-0 relative">
          {/* Product Carousel */}
          <div 
            ref={carouselScrollRef}
            className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory h-full"
            style={{ scrollBehavior: isScrolling ? 'smooth' : 'auto' }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {carouselProducts.map((carouselProduct, productIndex) => (
              <div key={carouselProduct.id} className="w-full flex-shrink-0 snap-start">
                <div 
                  ref={productIndex === currentProductIndex ? scrollRef : null}
                  className="h-full overflow-y-auto overscroll-contain scroll-smooth scrollbar-hide mobile-scroll-container"
                  style={{ WebkitOverflowScrolling: 'touch' }}
                >
                  <div className="flex flex-col lg:grid lg:grid-cols-2 lg:min-h-full">
                    {/* Image Gallery */}
                    <div className="relative bg-muted overflow-hidden lg:sticky lg:top-0 flex-shrink-0">
                      {/* No related products message */}
                      {carouselProducts.length === 1 && (
                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-background/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg border border-border">
                            <p className="text-xs text-muted-foreground"></p>
                          </div>
                        </div>
                      )}

                      {/* Product Navigation Dots - Bottom of Image - only show if there are related products */}
                      {carouselProducts.length > 1 && (
                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-20">
                          <div className="bg-background/60 backdrop-blur-md rounded-full px-[0.4vw] sm:px-[0.6vw] py-[0.2vw] sm:py-[0.4vw] shadow-lg border border-border">
                            <div className="flex items-center space-x-[0.4vw] sm:space-x-[0.6vw]">
                              {/* Left Arrow */}
                              <button
                                onClick={prevProduct}
                                disabled={currentProductIndex === 0}
                                className="p-[0.2vw] rounded-full hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                              >
                                <ChevronLeft className="w-[0.6vw] h-[0.6vw] sm:w-[0.8vw] sm:h-[0.8vw] min-w-[12px] min-h-[12px] max-w-[20px] max-h-[20px]" />
                              </button>
                              
                              {/* Mini Product Images with Collection Indicators */}
                              <div className="flex items-center space-x-[0.8vw] overflow-x-auto scrollbar-hide">
                                {carouselProducts.map((carouselProductItem, index) => {
                                  const sharedCollections = index > 0 ? getSharedCollectionNames(product, carouselProductItem) : []
                                  
                                  return (
                                    <button
                                      key={carouselProductItem.id}
                                      onClick={() => {
                                        triggerHapticFeedback([100, 50]); // Double tap pattern for product selection
                                        goToProduct(index);
                                      }}
                                      className={`relative rounded-lg overflow-hidden transition-all border-2 group ${
                                        index === currentProductIndex 
                                          ? 'border-primary ring-2 ring-primary/20' 
                                          : 'border-transparent hover:border-border'
                                      }`}
                                      title={index > 0 
                                        ? `Related by collections: ${sharedCollections.join(', ')}` 
                                        : carouselProductItem.title
                                      }
                                    >
                                      <div className="w-[2vw] h-[3vw] sm:w-[2.4vw] sm:h-[3.6vw] min-w-[32px] min-h-[48px] max-w-[48px] max-h-[72px]">
                                        {carouselProductItem.images.edges[0]?.node ? (
                                          <ImageWithFallback
                                            src={carouselProductItem.images.edges[0].node.url}
                                            alt={carouselProductItem.title}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <span className="text-[0.3vw] sm:text-[0.4vw] min-text-[10px] max-text-[14px] text-muted-foreground">?</span>
                                          </div>
                                        )}
                                      </div>
                                    </button>
                                  )
                                })}
                              </div>
                              
                              {/* Right Arrow */}
                              <button
                                onClick={nextProduct}
                                disabled={currentProductIndex === carouselProducts.length - 1}
                                className="p-[0.2vw] rounded-full hover:bg-accent transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted-foreground hover:text-foreground"
                              >
                                <ChevronRight className="w-[0.6vw] h-[0.6vw] sm:w-[0.8vw] sm:h-[0.8vw] min-w-[12px] min-h-[12px] max-w-[20px] max-h-[20px]" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Main Image */}
                      <div 
                        className="relative w-full aspect-[2/3]"
                        onTouchStart={handleImageTouchStart}
                        onTouchEnd={handleImageTouchEnd}
                      >
                        {currentImage ? (
                          <ImageWithFallback
                            src={currentImage.url}
                            alt={currentImage.altText || currentProduct.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <span className="text-muted-foreground">No Image</span>
                          </div>
                        )}

                        {/* Image Navigation */}
                        {currentImages.length > 1 && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                              onClick={nextImage}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            
                            {/* Image indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                              {currentImages.map((_, index) => (
                                <button
                                  key={index}
                                  onClick={() => setCurrentImageIndex(index)}
                                  className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentImageIndex ? 'bg-primary' : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4 sm:p-6 space-y-6 pb-8 lg:pb-6">
                      {/* Price and Availability */}
                      <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center text-center space-y-2">
                          <span className="text-4xl font-semibold">
                            {currentPrice}
                          </span>
                          {(() => {
                            const quantity = selectedVariantNode?.quantityAvailable ?? currentProduct.variants.edges[0]?.node.quantityAvailable ?? 0;
                            return (
                              <div className="text-center">
                                <div className="text-lg text-muted-foreground">
                                  Stock: <span className={`font-medium ${quantity > 10 ? 'text-green-600' : quantity > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                                    {quantity > 0 ? `${quantity} available` : 'Out of stock'}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}
                        </div>

                        {/* Product Type and Vendor */}
                        <div className="flex flex-wrap gap-2 justify-center">
                          {currentProduct.productType && (
                            <Badge variant="outline">{currentProduct.productType}</Badge>
                          )}

                        </div>

                      </div>

                      {/* Description */}
                      <div className="space-y-2">
                        <h3 className="font-medium">Description</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {currentProduct.description || 'No description available'}
                        </p>
                      </div>

                      {/* Variant Selection */}
                      {currentProduct.variants.edges.length > 1 && (
                        <div>
                          <h3 className="font-semibold text-card-foreground mb-3 text-sm">Select Options</h3>
                          <div className="space-y-4">
                            {/* Group variants by option types */}
                            {(() => {
                              const optionGroups: { [key: string]: string[] } = {}
                              currentProduct.variants.edges.forEach(({ node: variant }) => {
                                variant.selectedOptions.forEach(option => {
                                  if (!optionGroups[option.name]) {
                                    optionGroups[option.name] = []
                                  }
                                  if (!optionGroups[option.name].includes(option.value)) {
                                    optionGroups[option.name].push(option.value)
                                  }
                                })
                              })
                              
                              return Object.entries(optionGroups).map(([optionName, values]) => (
                                <div key={optionName}>
                                  <label className="block font-medium text-card-foreground text-sm mb-2">
                                    {optionName}
                                  </label>
                                  <div className="flex flex-wrap gap-2">
                                    {values.map(value => {
                                      const variantEdge = currentProduct.variants.edges.find(edge => 
                                        edge.node.selectedOptions.some(opt => opt.name === optionName && opt.value === value)
                                      )
                                      const isSelected = selectedVariant === variantEdge?.node.id
                                      const variant = variantEdge?.node
                                      
                                      return (
                                        <button
                                          key={value}
                                          onClick={() => setSelectedVariant(variantEdge?.node.id || '')}
                                          disabled={!variant?.availableForSale}
                                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            isSelected
                                              ? 'bg-primary text-primary-foreground'
                                              : variant?.availableForSale
                                              ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                              : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                          }`}
                                        >
                                          {value}
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>
                              ))
                            })()}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {productIndex === currentProductIndex && currentVariant?.availableForSale && (
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                          <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-[#2ECC71] dark:bg-[#2962FF] hover:bg-[#27AE60] dark:hover:bg-[#1E88E5] text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Collect Now</span>
                          </button>
                          <p className="text-xs text-muted-foreground text-center mt-2">By STUFFS.NYC</p>

                        </div>
                      )}

                      {/* Out of Stock */}
                      {productIndex === currentProductIndex && !currentVariant?.availableForSale && (
                        <div className="pt-4">
                          <div className="bg-muted text-muted-foreground px-6 py-3 rounded-lg text-center font-medium">
                            Out of Stock
                          </div>
                        </div>
                      )}

                      {/* POSTERS Brand Metadata Section */}
                      {productIndex === currentProductIndex && product.vendor === 'POSTERS' && (() => {
                        // Extract playlist and location from the original product that opened the popup
                        const playlistField = product.collections.edges
                          .flatMap(({ node: collection }) => collection.metafields || [])
                          .find(field => field && field.namespace === 'custom' && field.key === 'playlist');
                        
                        const locationField = product.collections.edges
                          .flatMap(({ node: collection }) => collection.metafields || [])
                          .find(field => field && field.namespace === 'custom' && field.key === 'location');

                        // Only show section if we have location data (no playlist here anymore)
                        if (!locationField) return null;

                        return (
                          <div className="space-y-3 pt-4 border-t border-border">

                            
                            {locationField && (
                              <div className="space-y-2">

                                <p className="text-sm text-card-foreground flex items-center gap-2 border border-border rounded-[15px] px-3 py-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  {locationField.value}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playlist Player - Bottom */}
        {(() => {
          // Extract playlist from the original product that opened the popup
          const playlistField = product.collections.edges
            .flatMap(({ node: collection }) => collection.metafields || [])
            .find(field => field && field.namespace === 'custom' && field.key === 'playlist');
          
          // Only show if we have playlist data
          if (!playlistField) return null;

          return (
            <div className="border-t border-border shrink-0 bg-muted/30">
              {/* Minimized View */}
              {isPlayerMinimized ? (
                <button
                  onClick={() => setIsPlayerMinimized(false)}
                  className="w-full px-3 sm:px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-card-foreground">Inspired by a Playlist</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground group-hover:text-card-foreground transition-colors">
                    <span className="text-xs">Click to expand</span>
                    <ChevronUp className="w-4 h-4" />
                  </div>
                </button>
              ) : (
                /* Maximized View */
                <div className="px-2 sm:px-3 py-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Playlist</span>
                    <button
                      onClick={() => setIsPlayerMinimized(true)}
                      className="p-0 rounded-full hover:bg-accent transition-colors text-muted-foreground hover:text-card-foreground"
                      title="Minimize player"
                    >
                      <ChevronDown className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <SpotifyMiniPlayer 
                    playlistUrl={playlistField.value} 
                    className="w-full"
                  />
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}