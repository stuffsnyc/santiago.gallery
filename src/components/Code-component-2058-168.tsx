import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Mail, Phone, MapPin, ExternalLink, Instagram } from 'lucide-react';
import santiagoProfileImage from 'figma:asset/4d9ae3da4f4c863e5a841e4fdf3d68b191c7b8ba.png';

export function Footer() {
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  const artistBio = `Santiago Camiro is an independent artist who emerged to embrace the chaos of lethargy and friction, transforming them into opportunities for creation. His work is born from the fragments of daily life—urban textures, fleeting emotions, and overlooked details—reassembled into new narratives. By drawing inspiration from the resources and encounters that cross his path, he redefines the ordinary into something profound. His art is not only a reflection of survival within disorder, but also a celebration of resilience, adaptation, and the endless possibility of beauty found in unexpected places.`;

  const pages = {
    about: {
      title: "About Me",
      content: (
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-shrink-0">
                <img
                  src={santiagoProfileImage}
                  alt="Santiago Camiro - Artist Portrait"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-border"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold">Santiago Camiro</h3>
                  <a 
                    href="https://www.instagram.com/santiago.camiro/" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                    @santiago.camiro
                  </a>
                </div>
                <p className="text-muted-foreground leading-relaxed">{artistBio}</p>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Artistic Philosophy</h4>
            <p className="text-muted-foreground leading-relaxed">
              My art emerges from the intersection of chaos and purpose, where everyday fragments become the building blocks of new narratives. I believe in the transformative power of resilience and the beauty that can be discovered in the most unexpected places.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Inspiration</h4>
            <p className="text-muted-foreground leading-relaxed">
              Drawing from urban environments, fleeting emotions, and overlooked details, I create work that speaks to the universal experience of adaptation and survival in an ever-changing world.
            </p>
          </div>
        </div>
      )
    },
    terms: {
      title: "Terms & Conditions",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Artwork Purchases</h4>
            <p className="text-muted-foreground leading-relaxed">
              All artwork sales are final. Original pieces are sold as-is and come with a certificate of authenticity. Prints and merchandise may be returned within 14 days of delivery if in original condition.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Shipping & Handling</h4>
            <p className="text-muted-foreground leading-relaxed">
              Shipping costs are calculated at checkout. Original artwork requires special handling and may take 2-4 weeks for delivery. Prints typically ship within 3-5 business days.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Copyright & Usage</h4>
            <p className="text-muted-foreground leading-relaxed">
              All artwork remains the intellectual property of Santiago Camiro. Reproduction, distribution, or commercial use without explicit written permission is prohibited.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Commission Work</h4>
            <p className="text-muted-foreground leading-relaxed">
              Custom commissions require a 50% deposit before work begins. Timeline and final pricing will be discussed during initial consultation.
            </p>
          </div>
        </div>
      )
    },
    privacy: {
      title: "Privacy Policy",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-2">Information Collection</h4>
            <p className="text-muted-foreground leading-relaxed">
              We collect only essential information needed to process orders and communicate with customers, including name, email address, shipping address, and payment information.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Data Usage</h4>
            <p className="text-muted-foreground leading-relaxed">
              Personal information is used solely for order fulfillment, customer service, and occasional updates about new artwork or exhibitions. We never sell or share your data with third parties.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Email Communications</h4>
            <p className="text-muted-foreground leading-relaxed">
              By providing your email, you may receive updates about new releases, exhibitions, and special offers. You can unsubscribe at any time using the link provided in emails.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Data Security</h4>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate security measures to protect your personal information. Payment processing is handled securely through encrypted third-party services.
            </p>
          </div>
        </div>
      )
    },
    contact: {
      title: "Contact",
      content: (
        <div className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">Get in Touch</h4>
            <p className="text-muted-foreground leading-relaxed mb-4">
              For inquiries about artwork, commissions, collaborations, or press opportunities, please reach out using the contact information below.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <a href="mailto:contact@santiago.gallery" className="text-muted-foreground hover:text-foreground transition-colors">
                  contact@santiago.gallery
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <a href="tel:+19297086842" className="text-muted-foreground hover:text-foreground transition-colors">
                  +1 (929) 708-6842
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">2201 Caton Ave, Brooklyn, NY 11226</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Instagram className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Instagram</p>
                <a 
                  href="https://www.instagram.com/santiago.camiro/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  @santiago.camiro
                </a>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Response Time</h4>
            <p className="text-muted-foreground leading-relaxed">
              I typically respond to inquiries within 24-48 hours. For urgent matters, please call directly.
            </p>
          </div>
        </div>
      )
    }
  };

  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Artist Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={santiagoProfileImage}
                alt="Santiago Camiro"
                className="w-12 h-12 rounded-full object-cover border border-border"
              />
              <h3 className="font-semibold">Santiago Camiro</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Independent artist embracing chaos and transforming fragments of daily life into profound narratives.
            </p>
            <div className="space-y-2">
              <a 
                href="mailto:contact@santiago.gallery" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="w-4 h-4" />
                contact@santiago.gallery
              </a>
              <a 
                href="tel:+19297086842" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="w-4 h-4" />
                +1 (929) 708-6842
              </a>
              <a 
                href="https://www.instagram.com/santiago.camiro/" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Instagram className="w-4 h-4" />
                @santiago.camiro
              </a>
            </div>
          </div>

          {/* Pages */}
          <div className="space-y-4">
            <h3 className="font-semibold">Pages</h3>
            <nav className="space-y-2">
              {Object.entries(pages).map(([key, page]) => (
                <Dialog key={key} open={openDialog === key} onOpenChange={(open) => setOpenDialog(open ? key : null)}>
                  <DialogTrigger asChild>
                    <button className="block text-sm text-muted-foreground hover:text-foreground transition-colors text-left">
                      {page.title}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle>{page.title}</DialogTitle>
                      <DialogDescription>
                        {page.title} information
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh] pr-4">
                      {page.content}
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              ))}
            </nav>
          </div>

          {/* Marketplace */}
          <div className="space-y-4">
            <h3 className="font-semibold">Marketplace</h3>
            <div>
              <a 
                href="https://stuffs.nyc" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                STUFFS.NYC
              </a>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Discover unique artwork and creative pieces from independent artists.
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">

            <div className="text-sm text-muted-foreground leading-relaxed">
              2201 Caton Ave<br />
              Brooklyn, NY 11226
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Santiago Camiro. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by <span className="font-medium">STUFFS.NYC</span>
          </p>
        </div>
      </div>
    </footer>
  );
}