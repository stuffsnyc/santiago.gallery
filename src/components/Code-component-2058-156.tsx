import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Tag, Store, Calendar, Search } from 'lucide-react';

interface CategoryFilterProps {
  collections: string[];
  vendors: string[];
  selectedCollection: string;
  selectedVendor: string;
  selectedDateSort: string;
  searchTerm: string;
  onCollectionChange: (collection: string) => void;
  onVendorChange: (vendor: string) => void;
  onDateSortChange: (sort: string) => void;
  onSearchChange: (search: string) => void;
}

export function CategoryFilter({ 
  collections,
  vendors,
  selectedCollection,
  selectedVendor,
  selectedDateSort,
  searchTerm,
  onCollectionChange,
  onVendorChange,
  onDateSortChange,
  onSearchChange
}: CategoryFilterProps) {
  const handleClearCollection = () => {
    onCollectionChange('all');
  };

  const handleClearVendor = () => {
    onVendorChange('all');
  };

  const handleClearDateSort = () => {
    onDateSortChange('none');
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleClearAll = () => {
    onSearchChange('');
    onCollectionChange('all');
    onVendorChange('all');
    onDateSortChange('none');
  };

  const hasActiveFilters = 
    (searchTerm.trim() !== '') ||
    (selectedCollection !== 'all') ||
    (selectedVendor !== 'all') ||
    (selectedDateSort !== 'none');

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="space-y-4">
        {/* Search Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <label>Search</label>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-input-background border-border"
            />
          </div>
        </div>
        
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

        {/* Date Sort Filter */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <label>Sort by Date</label>
          </div>
          <Select value={selectedDateSort} onValueChange={onDateSortChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="No date sorting" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No date sorting</SelectItem>
              <SelectItem value="new-to-old">New to Old</SelectItem>
              <SelectItem value="old-to-new">Old to New</SelectItem>
              <SelectItem value="random">Random Order</SelectItem>
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
          
          {searchTerm.trim() !== '' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={handleClearSearch}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          
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

          {selectedDateSort !== 'none' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {selectedDateSort === 'new-to-old' ? 'Newest First' : 
               selectedDateSort === 'old-to-new' ? 'Oldest First' : 
               'Random Order'}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:bg-transparent"
                onClick={handleClearDateSort}
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