import { ShopifyProduct } from '../types/shopify';
import { Card, CardContent, CardHeader } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { GalaxyImageWrapper } from './GalaxyImageWrapper';

interface ProductCardProps {
  product: ShopifyProduct;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const firstImage = product.images.edges[0]?.node;

  return (
    <Card className="h-full flex flex-col overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader className="p-0">
        <GalaxyImageWrapper className="aspect-[2/3]">
          {firstImage ? (
            <ImageWithFallback
              src={firstImage.url}
              alt={firstImage.altText || product.title}
              className="w-full aspect-[2/3] object-cover"
              optimizationOptions={{
                width: 400,
                height: 600,
                quality: 85
              }}
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image</span>
            </div>
          )}
        </GalaxyImageWrapper>
      </CardHeader>
      
      <CardContent className="p-4 flex-1">
        <h3 className="mb-2 line-clamp-2">{product.title}</h3>
        <p className="text-muted-foreground line-clamp-3 mb-3">
          {product.description || 'No description available'}
        </p>

      </CardContent>
    </Card>
  );
}