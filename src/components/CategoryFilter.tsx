import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Tag, Store } from 'lucide-react';

interface CategoryFilterProps {
  collections: string[];
  vendors: string[];
  selectedCollection: string;
  selectedVendor: string;
  onCollectionChange: (collection: string) => void;
  onVendorChange: (vendor: string) => void;
}

export function CategoryFilter({ 
  collections,
  vendors,
  selectedCollection,
  selectedVendor,
  onCollectionChange,
  onVendorChange
}: CategoryFilterProps) {
  const handleClearCollection = () => {
    onCollectionChange('all');
  };

  const handleClearVendor = () => {
    onVendorChange('all');
  };

  const handleClearAll = () => {
    onCollectionChange('all');
    onVendorChange('all');
  };

  const hasActiveFilters = 
    (selectedCollection !== 'all') ||
    (selectedVendor !== 'all');

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="space-y-4">        
        {/* Vendor/Brand Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Store className="h-4 w-4 text-muted-foreground" />
            <label>Category</label>
          </div>
          <Select value={selectedVendor} onValueChange={onVendorChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Category</SelectItem>
              {vendors.map(vendor => (
                <SelectItem key={vendor} value={vendor}>
                  {vendor}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Collection Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <label>Collections</label>
          </div>
          <Select value={selectedCollection} onValueChange={onCollectionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Collections" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collections</SelectItem>
              {collections.map(collection => (
                <SelectItem key={collection} value={collection}>
                  {collection}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="w-full"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {selectedCollection !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {selectedCollection}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={handleClearCollection}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {selectedVendor !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Store className="h-3 w-3" />
              {selectedVendor}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={handleClearVendor}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}