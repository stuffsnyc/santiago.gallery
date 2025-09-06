import { ShopifyProduct } from '../types/shopify';
import { ProductCard } from './ProductCard';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  products: ShopifyProduct[];
  isLoading?: boolean;
  onProductClick?: (product: ShopifyProduct) => void;
  hasMoreProducts?: boolean;
  isLoadingMore?: boolean;
}

export function ProductGrid({ products, isLoading, onProductClick, hasMoreProducts, isLoadingMore }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg text-muted-foreground">No products found</h3>
        <p className="text-muted-foreground">Your Shopify store doesn't have any products yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>
      
      {/* Auto-loading indicator */}
      {isLoadingMore && (
        <div className="flex justify-center pt-8 pb-4">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Loading more products...</span>
          </div>
        </div>
      )}
      
      {/* End of products message */}
      {!hasMoreProducts && products.length > 0 && (
        <div className="flex justify-center pt-8 pb-4">
          <div className="text-center text-muted-foreground">
            <p className="text-sm"></p>
            <div className="w-24 h-px bg-border mx-auto mt-2"></div>
          </div>
        </div>
      )}
    </div>
  );
}