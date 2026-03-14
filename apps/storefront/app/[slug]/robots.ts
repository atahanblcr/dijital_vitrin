import { MetadataRoute } from 'next';

interface RobotsProps {
  params: { slug: string };
}

export default function robots({ params }: RobotsProps): MetadataRoute.Robots {
  const slug = params.slug;
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${slug}.dijitalvitrin.com` 
    : `http://${slug}.localhost:3000`;

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
