export default function BusinessJsonLd({ business }: { business: any }) {
  const url = `https://${business.slug}.dijitalvitrin.com`;
  
  // Create business hours array for schema
  let openingHours: string[] = [];
  if (business.businessHours && Array.isArray(business.businessHours)) {
    const dayMap = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    business.businessHours.forEach((bh: any) => {
      if (bh.is_open && bh.open_time && bh.close_time) {
        // Simple mapping, assumes day_of_week is 0-6 (Sun-Sat)
        const day = dayMap[bh.day_of_week];
        if (day) {
           // Format time properly (e.g., 09:00-18:00)
           const open = bh.open_time.substring(0, 5);
           const close = bh.close_time.substring(0, 5);
           openingHours.push(`${day} ${open}-${close}`);
        }
      }
    });
  }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: url,
    telephone: business.whatsapp ? `+${business.whatsapp.replace(/\D/g, '')}` : undefined,
    image: business.logo_url || undefined,
    description: business.about_text || business.slogan || `${business.name} dijital vitrini.`,
    openingHours: openingHours.length > 0 ? openingHours : undefined,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'TR' // Assuming Turkey
    },
    sameAs: [
      business.instagram_url,
      business.facebook_url,
      business.tiktok_url
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
