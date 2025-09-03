import { useState, useEffect } from 'react';
import { Button } from './ui/button';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptEssential = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    
    // Trigger a custom event for GA4 initialization
    window.dispatchEvent(new Event('cookieConsentAccepted'));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div 
          className="rounded-lg border backdrop-blur-md p-6 shadow-lg"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'rgba(0, 0, 0, 0.08)',
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 space-y-2">
              <h3 className="font-medium tracking-tight">
                Privacy & Tracking Transparency
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We use tracking tools from <span className="font-medium text-foreground">Google</span>, <span className="font-medium text-foreground">Facebook (Meta)</span>, and <span className="font-medium text-foreground">TikTok</span> to improve your experience, analyze our traffic, and enhance our services. By continuing, you consent to our use of these tools.{' '}
                <button 
                  className="underline underline-offset-2 hover:no-underline transition-all"
                  onClick={() => {/* This would open privacy policy modal */}}
                >
                  Read our Privacy & Tracking Policy
                </button>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleAcceptEssential}
                size="sm"
                className="px-8 py-2.5 h-auto"
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}