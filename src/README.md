# Santiago Camiro Gallery - Next.js

A modern, responsive product catalog for artist Santiago Camiro's work, featuring Shopify integration, GDPR compliance, and a comprehensive design system.

## Features

- **Next.js 14** with App Router
- **Shopify Storefront API** integration
- **Tailwind CSS v4** for styling
- **TypeScript** for type safety
- **Responsive design** optimized for all devices
- **GDPR-compliant** cookie consent system
- **Dark/Light theme** support
- **Infinite scroll** product loading
- **Product detail modals** with image carousels
- **Category and vendor filtering**
- **Search and analytics** integration ready

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm, yarn, or pnpm
- Shopify store with Storefront API access

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd santiago-camiro-gallery
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Add your Shopify credentials:

   ```env
   NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
   NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=your-storefront-access-token
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and Tailwind configuration
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page component
├── components/            # React components
│   ├── ui/               # Reusable UI components (shadcn/ui)
│   └── ...               # Feature-specific components
├── services/             # API services (Shopify, etc.)
├── types/                # TypeScript type definitions
├── utils/                # Utility functions and hooks
└── supabase/             # Supabase functions (if using)
```

## Key Components

### CatalogHeader

- Product count display
- Collection and vendor filtering
- Theme toggle
- Responsive hamburger menu

### ProductGrid

- Infinite scroll loading
- Responsive grid layout
- Loading states and skeletons
- Product interaction handling

### ProductDetailPopup

- Full-screen product modals
- Image carousels
- Variant selection
- Related products
- Add to cart integration

### GDPRCookieConsent

- GDPR-compliant cookie consent
- Granular cookie preferences
- Privacy policy modal
- Persistent user choices

## Shopify Integration

The application uses Shopify's Storefront API to:

- Fetch product catalogs
- Handle product variants
- Manage collections and vendors
- Support checkout processes

## Styling

- **Tailwind CSS v4** with custom design tokens
- **CSS Custom Properties** for theme variables
- **Responsive design** with mobile-first approach
- **Dark/Light theme** support
- **Typography system** with consistent scaling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- Railway
- Digital Ocean App Platform
- AWS Amplify

## Environment Variables

```env
# Shopify Configuration
NEXT_PUBLIC_SHOPIFY_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN=your-storefront-access-token

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your-google-analytics-id

# Optional: Supabase (for extended features)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary to Santiago Camiro and STUFFS.NYC.

## Support

For questions or support, contact: contact@santiago.gallery