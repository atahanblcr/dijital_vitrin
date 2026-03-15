import { getStorefrontData } from '../../lib/api';
import Hero from '../../components/sections/Hero';
import CampaignCarousel from '../../components/sections/CampaignCarousel';
import ProductCatalog from '../../components/sections/ProductCatalog';

interface PageProps {
  params: { slug: string };
}

export default async function StorefrontHomePage({ params }: any) {
  const resolvedParams = await params;
  const data = await getStorefrontData(resolvedParams.slug);

  if (!data?.business) {
    return null; // Layout will handle the 404
  }

  const { business, products } = data;
  const campaigns = products?.filter((p: any) => p.is_campaign) || [];

  return (
    <div className="flex flex-col gap-12 pb-12">
      <Hero business={business} />
      
      {campaigns.length > 0 && (
        <CampaignCarousel products={campaigns} businessSlug={business.slug} />
      )}
      
      <ProductCatalog 
        products={products || []} 
        businessSlug={business.slug}
        categories={data.categories || []} 
      />
    </div>
  );
}
