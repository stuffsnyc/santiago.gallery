import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Settings, Shield, BarChart3, Target, Users } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

const defaultPreferences: CookiePreferences = {
  essential: true, // Always true, cannot be disabled
  analytics: false,
  marketing: false,
  functional: false,
};

export function GDPRCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('gdpr-cookie-consent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookieConsent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Failed to parse cookie preferences:', error);
        setShowBanner(true);
      }
    }
  }, []);

  const savePreferences = (newPreferences: CookiePreferences) => {
    localStorage.setItem('gdpr-cookie-consent', JSON.stringify(newPreferences));
    setPreferences(newPreferences);
    setShowBanner(false);
    setShowPreferences(false);

    // Trigger events based on consent
    if (newPreferences.analytics) {
      window.dispatchEvent(new Event('cookieConsentAccepted'));
    }
    
    // Store individual consent flags for script loading
    localStorage.setItem('analytics-consent', newPreferences.analytics.toString());
    localStorage.setItem('marketing-consent', newPreferences.marketing.toString());
    localStorage.setItem('functional-consent', newPreferences.functional.toString());

    window.dispatchEvent(new CustomEvent('cookiePreferencesUpdated', { 
      detail: newPreferences 
    }));
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    };
    savePreferences(allAccepted);
  };

  const handleAcceptEssential = () => {
    savePreferences(defaultPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const cookieInfo = {
    essential: {
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.",
      examples: ["Session management", "Security", "Site functionality"],
      icon: <Shield className="w-4 h-4" />,
      required: true
    },
    analytics: {
      title: "Analytics Cookies",
      description: "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our services.",
      examples: ["Google Analytics", "Page view tracking", "User behavior analysis"],
      icon: <BarChart3 className="w-4 h-4" />,
      required: false
    },
    marketing: {
      title: "Marketing Cookies",
      description: "These cookies are used to track visitors across websites and display ads that are relevant and engaging for individual users.",
      examples: ["Facebook Pixel", "Google Ads", "Retargeting"],
      icon: <Target className="w-4 h-4" />,
      required: false
    },
    functional: {
      title: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalization, such as remembering your preferences.",
      examples: ["Theme preferences", "Language settings", "User interface customization"],
      icon: <Users className="w-4 h-4" />,
      required: false
    }
  };

  const privacyPolicyContent = (
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
        <h4 className="font-medium mb-2">Cookie Usage</h4>
        <p className="text-muted-foreground leading-relaxed">
          We use cookies to enhance your browsing experience, analyze website traffic, and provide personalized content. You can control cookie preferences through our cookie consent banner.
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
      <div>
        <h4 className="font-medium mb-2">Third-Party Services</h4>
        <p className="text-muted-foreground leading-relaxed">
          Our website may contain links to third-party services. We are not responsible for their privacy practices and encourage you to review their privacy policies.
        </p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Contact Us</h4>
        <p className="text-muted-foreground leading-relaxed">
          If you have any questions about this Privacy Policy or how we handle your data, please contact us at contact@santiago.gallery.
        </p>
      </div>
    </div>
  );

  if (!showBanner) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
        <div className="mx-auto max-w-6xl">
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Your Privacy Choices</CardTitle>
              </div>
              <CardDescription className="text-sm leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                Choose which types of cookies you're comfortable with. You can change your preferences at any time.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0 h-auto text-xs underline">
                        View Cookie Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5" />
                          Cookie Preferences
                        </DialogTitle>
                        <DialogDescription>
                          Manage your cookie consent preferences. Essential cookies are required for basic site functionality.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="space-y-6">
                          {Object.entries(cookieInfo).map(([key, info]) => (
                            <div key={key} className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    {info.icon}
                                    <h4 className="font-medium">{info.title}</h4>
                                  </div>
                                  {info.required && (
                                    <Badge variant="secondary" className="text-xs">
                                      Required
                                    </Badge>
                                  )}
                                </div>
                                <Switch
                                  checked={preferences[key as keyof CookiePreferences]}
                                  onCheckedChange={(checked) => {
                                    if (key !== 'essential') {
                                      setPreferences(prev => ({
                                        ...prev,
                                        [key]: checked
                                      }));
                                    }
                                  }}
                                  disabled={key === 'essential'}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                {info.description}
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {info.examples.map((example, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {example}
                                  </Badge>
                                ))}
                              </div>
                              {key !== 'functional' && <Separator />}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="flex gap-3 pt-4 border-t">
                        <Button onClick={handleSavePreferences} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
                          Save Preferences
                        </Button>
                        <Button variant="outline" onClick={() => setShowPreferences(false)}>
                          Cancel
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <span>•</span>
                  <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-xs underline"
                      >
                        Privacy Policy
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Privacy Policy
                        </DialogTitle>
                        <DialogDescription>
                          Learn how we collect, use, and protect your personal information.
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        {privacyPolicyContent}
                      </ScrollArea>
                      <div className="flex justify-end pt-4 border-t">
                        <Button variant="outline" onClick={() => setShowPrivacyPolicy(false)}>
                          Close
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={handleAcceptEssential}
                    className="flex-1 sm:flex-none"
                  >
                    Essential Only
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowPreferences(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                  <Button 
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}