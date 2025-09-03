import { ShopifyResponse } from '../types/shopify';

const SHOPIFY_DOMAIN = 'tndztv-yx.myshopify.com';
const STOREFRONT_ACCESS_TOKEN = '64aab96a1d4aaa428d04fb9d6519a916';

const PRODUCTS_QUERY = `
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          vendor
          collections(first: 5) {
            edges {
              node {
                id
                title
                handle
                metafields(identifiers: [
                  {namespace: "custom", key: "playlist"},
                  {namespace: "custom", key: "location"}
                ]) {
                  key
                  value
                  namespace
                }
              }
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url(transform: {maxWidth: 1200, maxHeight: 1800, preferredContentType: WEBP})
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          variants(first: 100) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                quantityAvailable
                selectedOptions {
                  name
                  value
                }
                sku
              }
            }
          }
        }
      }
    }
  }
`;

export async function fetchProducts(count: number = 20): Promise<ShopifyResponse> {
  const response = await fetch(`https://${SHOPIFY_DOMAIN}/api/2023-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({
      query: PRODUCTS_QUERY,
      variables: { first: count },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}