import { notFound } from 'next/navigation';
import { getStorefrontData, getStorefrontBlog } from '../../../../lib/api';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import BlogJsonLd from '../../../../components/blog/BlogJsonLd';
import { generateBaseMetadata } from '../../../../components/seo/generateMetadata';

interface PageProps {
  params: { slug: string; blogSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [storeData, data] = await Promise.all([
    getStorefrontData(params.slug),
    getStorefrontBlog(params.slug, params.blogSlug)
  ]);
  
  if (!data?.blog || !storeData?.business) {
    return { title: 'Yazı Bulunamadı' };
  }
  
  const b = data.blog;
  const business = storeData.business;
  const url = `https://${business.slug}.dijitalvitrin.com/blog/${b.slug}`;

  return generateBaseMetadata({
    title: b.title,
    description: b.meta_description || b.title,
    image: b.cover_image_url || business.logo_url || undefined,
    url,
    businessName: business.name,
    type: 'article',
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const [storeData, data] = await Promise.all([
    getStorefrontData(params.slug),
    getStorefrontBlog(params.slug, params.blogSlug)
  ]);

  if (!data?.blog || !storeData?.business) {
    notFound();
  }

  const post = data.blog;
  const business = storeData.business;

  const dateObj = new Date(post.published_at || post.created_at);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <BlogJsonLd post={post} business={business} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Link 
          href={`/${params.slug}/blog`}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Blog'a Dön
        </Link>

        {post.cover_image_url && (
          <div className="w-full aspect-[21/9] md:aspect-[2.5/1] relative rounded-3xl overflow-hidden mb-8 shadow-sm">
            <img 
              src={post.cover_image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center text-gray-500 text-sm">
            <span>{formattedDate}</span>
          </div>
        </header>

        {/* 
          Tailwind Typography plugin is required for 'prose' class to render Tiptap content properly.
          This will automatically style h1, h2, p, ul, ol, a, etc. 
        */}
        <div 
          className="prose prose-lg prose-gray max-w-none hover:prose-a:text-[var(--color-primary)] prose-a:transition-colors prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </>
  );
}
