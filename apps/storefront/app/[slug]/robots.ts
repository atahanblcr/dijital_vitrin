import { MetadataRoute } from 'next';

interface RobotsProps {
  params: { slug: string };
}

export default async function robots({ params }: any): Promise<MetadataRoute.Robots> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
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
