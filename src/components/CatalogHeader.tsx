
import { useState } from 'react';
import { Menu, Mail, Phone, MapPin, ExternalLink, Instagram, Map } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { CategoryFilter } from './CategoryFilter';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';
import santiagoProfileImage from 'figma:asset/4d9ae3da4f4c863e5a841e4fdf3d68b191c7b8ba.png';

interface CatalogHeaderProps {
  productCount: number;
  collections: string[];
  vendors: string[];
  selectedCollection: string;
  selectedVendor: string;
  selectedDateSort: string;
  onCollectionChange: (collection: string) => void;
  onVendorChange: (vendor: string) => void;
  onDateSortChange: (sort: string) => void;
}

export function CatalogHeader({ 
  productCount, 
  collections,
  vendors,
  selectedCollection,
  selectedVendor,
  selectedDateSort,
  onCollectionChange,
  onVendorChange,
  onDateSortChange
}: CatalogHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSitemapOpen, setIsSitemapOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success('Thank you for subscribing to our newsletter!');
      setNewsletterEmail('');
    }
  };

  const artistBio = `Santiago Camiro is an independent artist who emerged to embrace the chaos of lethargy and friction, transforming them into opportunities for creation. His work is born from the fragments of daily life—urban textures, fleeting emotions, and overlooked details—reassembled into new narratives.`;

  const sitemapContent = {
    about: {
      title: "About Me",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={santiagoProfileImage}
              alt="Santiago Camiro"
              className="w-16 h-16 rounded-full object-cover border border-border"
            />
            <div>
              <h4 className="font-medium">Santiago Camiro</h4>
              <a 
                href="https://www.instagram.com/santiago.camiro/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-3 h-3" />
                @santiago.camiro
              </a>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{artistBio}</p>
        </div>
      )
    },
    contact: {
      title: "Contact Information",
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Email</p>
              <a href="mailto:contact@santiago.gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                contact@santiago.gallery
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Phone</p>
              <a href="tel:+19297086842" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                +1 (929) 708-6842
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-sm">Address</p>
              <p className="text-sm text-muted-foreground">2201 Caton Ave, Brooklyn, NY 11226</p>
            </div>
          </div>
        </div>
      )
    },
    marketplace: {
      title: "Marketplace",
      content: (
        <div className="space-y-3">
          <a 
            href="https://stuffs.nyc" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            STUFFS.NYC
          </a>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Discover unique artwork and creative pieces from independent artists.
          </p>
        </div>
      )
    }
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-6">
                <SheetHeader className="mb-6">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                
                {/* Filters */}
                <div className="mb-8">
                  <h3 className="font-medium mb-4">Filters & Categories</h3>
                  <CategoryFilter
                    collections={collections}
                    vendors={vendors}
                    selectedCollection={selectedCollection}
                    selectedVendor={selectedVendor}
                    selectedDateSort={selectedDateSort}
                    onCollectionChange={onCollectionChange}
                    onVendorChange={onVendorChange}
                    onDateSortChange={onDateSortChange}
                  />
                </div>

                <Separator className="mb-6" />

                {/* Newsletter Subscription */}
                <div className="mb-8 p-4 border rounded-lg bg-muted/50">
                  <h3 className="font-medium mb-3">Newsletter</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Stay updated with new artwork releases and exhibitions.
                  </p>
                  <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                    <div>
                      <Label htmlFor="newsletter-email" className="text-sm">Email Address</Label>
                      <Input
                        id="newsletter-email"
                        type="email"
                        placeholder="your@email.com"
                        value={newsletterEmail}
                        onChange={(e) => setNewsletterEmail(e.target.value)}
                        required
                        className="mt-1"
                      />
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      Subscribe
                    </Button>
                  </form>
                </div>

                <Separator className="mb-6" />

                {/* Sitemap Button */}
                <div className="space-y-3">
                  <Dialog open={isSitemapOpen} onOpenChange={setIsSitemapOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Map className="w-4 h-4 mr-2" />
                        Site Information
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle>Site Information</DialogTitle>
                        <DialogDescription>
                          Learn more about Santiago Camiro and his work
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-6">
                          {Object.entries(sitemapContent).map(([key, section]) => (
                            <div key={key}>
                              <h3 className="font-medium mb-3">{section.title}</h3>
                              {section.content}
                              {key !== 'marketplace' && <Separator className="mt-4" />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </div>
              </SheetContent>
            </Sheet>
            <div>
              <h1>SANTIAGO.GALLERY</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}