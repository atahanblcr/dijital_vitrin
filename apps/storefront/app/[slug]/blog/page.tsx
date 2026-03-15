import { getStorefrontBlogs } from '../../../lib/api';
import BlogCard from '../../../components/blog/BlogCard';
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string };
}

export const metadata: Metadata = {
  title: 'Blog',
};

export default async function BlogListPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getStorefrontBlogs(resolvedParams.slug);
  const posts = data || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
        Blog & Duyurular
      </h1>
      
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-gray-500 border border-gray-100 shadow-sm">
          Henüz blog yazısı bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post: any) => (
            <div key={post.id} className="h-full">
              <BlogCard post={post} businessSlug={resolvedParams.slug} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
