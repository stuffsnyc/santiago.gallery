import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_TRACKING_ID = 'G-MSHKF09KLV';

export const useGoogleAnalytics = () => {
  useEffect(() => {
    const initializeGA4 = () => {
      // Check if GA4 is already loaded
      if (window.gtag) {
        return;
      }

      // Delay GA4 loading by 4 seconds
      const timeoutId = setTimeout(() => {
        // Initialize dataLayer
        window.dataLayer = window.dataLayer || [];
        
        // Define gtag function
        window.gtag = function gtag(...args: any[]) {
          window.dataLayer.push(args);
        };

        // Create and load the GA4 script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
        
        script.onload = () => {
          // Initialize GA4 after script loads
          window.gtag('js', new Date());
          window.gtag('config', GA_TRACKING_ID, {
            // Optional: Configure additional settings
            page_title: 'Santiago Gallery',
            page_location: window.location.href,
          });
          
          console.log('Google Analytics 4 initialized with 4-second delay');
        };

        // Add script to document head
        document.head.appendChild(script);
      }, 4000); // 4-second delay

      return timeoutId;
    };

    // Initialize GA4 on mount
    const timeoutId = initializeGA4();

    // Cleanup
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Function to track custom events
  const trackEvent = (eventName: string, parameters?: { [key: string]: any }) => {
    if (window.gtag) {
      window.gtag('event', eventName, parameters);
    }
  };

  // Function to track page views
  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if (window.gtag) {
      window.gtag('config', GA_TRACKING_ID, {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  return { trackEvent, trackPageView };
};