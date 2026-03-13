import { notFound } from 'next/navigation';
import { getStorefrontData, getStorefrontProduct } from '../../../../lib/api';
import ProductGallery from '../../../../components/product/ProductGallery';
import AttributeTable from '../../../../components/product/AttributeTable';
import { Metadata } from 'next';

interface PageProps {
  params: { slug: string; productSlug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getStorefrontProduct(params.slug, params.productSlug);
  
  if (!data?.product) {
    return { title: 'Ürün Bulunamadı' };
  }
  
  const p = data.product;
  const primaryImage = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url;

  return {
    title: p.name,
    description: p.short_desc || p.name,
    openGraph: {
      title: p.name,
      description: p.short_desc,
      images: primaryImage ? [primaryImage] : [],
      type: 'website',
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  // We need business info for the WhatsApp button link text and other context
  const [storeData, productData] = await Promise.all([
    getStorefrontData(params.slug),
    getStorefrontProduct(params.slug, params.productSlug)
  ]);

  if (!productData?.product || !storeData?.business) {
    notFound();
  }

  const { product, attributes } = productData;
  const business = storeData.business;

  // Numara formatlaması
  const cleanPhone = business.whatsapp.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('90') ? cleanPhone : `90${cleanPhone.replace(/^0+/, '')}`;
  const message = `Merhaba! ${business.name} — ${product.name} hakkında bilgi almak istiyorum.`;
  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 p-4 sm:p-8">
          
          {/* Sol Taraf: Görseller */}
          <div>
            <ProductGallery images={product.images || []} productName={product.name} />
          </div>

          {/* Sağ Taraf: Detaylar */}
          <div className="flex flex-col">
            
            {/* Üst Kısım: Başlık, Rozet ve Durum */}
            <div className="mb-6">
              {product.is_campaign && (
                <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full mb-3">
                  KAMPANYA
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.in_stock ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {product.in_stock ? 'Stokta Mevcut' : 'Tükendi'}
                </span>
              </div>
            </div>

            {/* Açıklama */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Ürün Hakkında</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.long_desc || product.short_desc || 'Açıklama bulunmuyor.'}
              </p>
            </div>

            {/* Özellikler Tablosu */}
            {attributes && attributes.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Özellikler</h3>
                <AttributeTable attributes={attributes} />
              </div>
            )}

            {/* Call to Action */}
            <div className="mt-auto pt-6 border-t border-gray-100">
              <a 
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-lg py-4 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
              >
                {/* SVG Icon included inline to reduce dependencies */}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" /><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" /><path d="M9 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z" /><path d="M14 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z" /></svg>
                WhatsApp'tan Bilgi Al
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
