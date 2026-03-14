export default function ProductJsonLd({ product, business }: { product: any; business: any }) {
  const url = `https://${business.slug}.dijitalvitrin.com/urun/${product.slug}`;
  
  const images = product.images?.map((img: any) => img.url) || [];
  if (images.length === 0 && business.logo_url) {
    images.push(business.logo_url);
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.long_desc || product.short_desc || `${product.name} - ${business.name}`,
    image: images,
    url: url,
    brand: {
      '@type': 'Brand',
      name: business.name
    },
    offers: {
      '@type': 'Offer',
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: business.name,
        url: `https://${business.slug}.dijitalvitrin.com`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
