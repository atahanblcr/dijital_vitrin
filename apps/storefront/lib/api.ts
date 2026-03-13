const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getStorefrontData(slug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}`, {
    next: { revalidate: 60, tags: ['storefront', slug] },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch storefront data');
  }
  
  return res.json();
}

export async function getStorefrontProducts(slug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/products`, {
    next: { revalidate: 60, tags: ['products', slug] },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return res.json();
}

export async function getStorefrontProduct(slug: string, productSlug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/products/${productSlug}`, {
    next: { revalidate: 60, tags: ['product', slug, productSlug] },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product details');
  }
  
  return res.json();
}

export async function getStorefrontBlogs(slug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/blog`, {
    next: { revalidate: 60, tags: ['blogs', slug] },
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }
  
  return res.json();
}

export async function getStorefrontBlog(slug: string, blogSlug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/blog/${blogSlug}`, {
    next: { revalidate: 60, tags: ['blog', slug, blogSlug] },
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch blog post');
  }
  
  return res.json();
}

// Track an analytics event
export async function trackEvent(data: {
  businessId: string;
  eventType: 'page_view' | 'product_view' | 'whatsapp_click' | 'blog_view';
  productId?: string;
  blogPostId?: string;
  isMobile?: boolean;
}) {
  try {
    await fetch(`${API_URL}/api/analytics/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}
