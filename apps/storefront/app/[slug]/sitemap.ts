import { MetadataRoute } from 'next';
import { getStorefrontData, getStorefrontProducts, getStorefrontBlogs } from '../../lib/api';

interface SitemapProps {
  params: { slug: string };
}

export default async function sitemap({ params }: any): Promise<MetadataRoute.Sitemap> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${slug}.dijitalvitrin.com` 
    : `http://${slug}.localhost:3000`;

  try {
    const [data, productsData, blogsData] = await Promise.all([
      getStorefrontData(slug),
      getStorefrontProducts(slug),
      getStorefrontBlogs(slug),
    ]);

    if (!data?.business) {
      return [];
    }

    const products = productsData || [];
    const blogs = blogsData || [];

    // Ana rotalar
    const routes = [
      '',
      '/urunler',
      '/blog',
      '/hakkimizda',
    ].map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: route === '' ? 1 : 0.8,
    }));

    // Ürün rotaları
    const productRoutes = products.map((product: any) => ({
      url: `${baseUrl}/urun/${product.slug}`,
      lastModified: new Date(product.updated_at || product.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Blog rotaları
    const blogRoutes = blogs.map((blog: any) => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updated_at || blog.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }));

    return [...routes, ...productRoutes, ...blogRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
      },
    ];
  }
}
