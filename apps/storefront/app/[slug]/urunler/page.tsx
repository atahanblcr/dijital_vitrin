import { notFound } from 'next/navigation';
import { getStorefrontData } from '../../../lib/api';
import { Metadata } from 'next';
import ProductCatalog from '../../../components/sections/ProductCatalog';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getStorefrontData(resolvedParams.slug);
  if (!data?.business) return { title: 'Ürünler' };
  
  return {
    title: `Ürün Kataloğu | ${data.business.name}`,
    description: `${data.business.name} dükkanındaki tüm ürünleri keşfedin ve WhatsApp üzerinden sipariş verin.`,
  };
}

export default async function ProductsPage({ params }: any) {
  const resolvedParams = await params;
  const data = await getStorefrontData(resolvedParams.slug);

  if (!data?.business) {
    notFound();
  }

  const { business, products, categories } = data;

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
         <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Tüm Ürünler</h1>
      </div>
      <ProductCatalog 
        products={products || []} 
        businessSlug={business.slug}
        categories={categories || []} 
      />
    </div>
  );
}
