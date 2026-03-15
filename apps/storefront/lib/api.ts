const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function getStorefrontData(slug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}`, {
    cache: 'no-store', // Always fetch fresh data to avoid stale cache
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch storefront data');
  }
  
  return res.json();
}

export async function getStorefrontProducts(slug: string, categoryId?: string) {
  const url = new URL(`${API_URL}/api/storefront/${slug}/products`);
  if (categoryId && categoryId !== 'all') {
    url.searchParams.append('categoryId', categoryId);
  }
  
  const res = await fetch(url.toString(), {
    cache: 'no-store', // Always fetch fresh products
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const json = await res.json();
  return json.data;
}

export async function getStorefrontProduct(slug: string, productSlug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/products/${productSlug}`, {
    cache: 'no-store', // Next.js 15: Önbelleği devre dışı bırak
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch product details');
  }
  
  const json = await res.json();
  return json.data;
}

export async function getStorefrontBlogs(slug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/blog`, {
    cache: 'no-store', // Always fetch fresh blogs
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch blogs');
  }
  
  const json = await res.json();
  return json.data;
}

export async function getStorefrontBlog(slug: string, blogSlug: string) {
  const res = await fetch(`${API_URL}/api/storefront/${slug}/blog/${blogSlug}`, {
    cache: 'no-store', // Always fetch fresh blog details
  });
  
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error('Failed to fetch blog post');
  }
  
  const json = await res.json();
  return json.data;
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
