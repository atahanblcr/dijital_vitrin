import { notFound } from 'next/navigation';
import { getStorefrontData, getStorefrontProduct } from '../../../../lib/api';
import ProductGallery from '../../../../components/product/ProductGallery';
import AttributeTable from '../../../../components/product/AttributeTable';
import ProductJsonLd from '../../../../components/product/ProductJsonLd';
import MobileStickyBar from '../../../../components/product/MobileStickyBar';
import { generateBaseMetadata } from '../../../../components/seo/generateMetadata';
import { Metadata } from 'next';

// Next.js metadata generation
export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Next.js 15 Fix: params is a Promise
  const resolvedParams = await params;
  const { slug, productSlug } = resolvedParams;
  
  const [storeData, data] = await Promise.all([
    getStorefrontData(slug),
    getStorefrontProduct(slug, productSlug)
  ]);
  
  if (!data?.product || !storeData?.business) {
    return { title: 'Ürün Bulunamadı' };
  }
  
  const p = data.product;
  const b = storeData.business;
  const primaryImage = p.images?.find((img: any) => img.is_primary)?.url || p.images?.[0]?.url;
  const url = `https://${b.slug}.dijitalvitrin.com/urun/${p.slug}`;

  return generateBaseMetadata({
    title: p.name,
    description: p.short_desc || p.name,
    image: primaryImage || b.logo_url || undefined,
    url,
    businessName: b.name,
    type: 'website',
  });
}

export default async function ProductDetailPage({ params }: any) {
  // Next.js 15 Fix: params is a Promise
  const resolvedParams = await params;
  const { slug, productSlug } = resolvedParams;

  const [storeData, productData] = await Promise.all([
    getStorefrontData(slug),
    getStorefrontProduct(slug, productSlug)
  ]);

  if (!productData?.product || !storeData?.business) {
    notFound();
  }

  const { product, attributes } = productData;
  const business = storeData.business;

  // Numara formatlaması
  const cleanPhone = business.whatsapp.replace(/\D/g, '');
  let formattedPhone = cleanPhone;
  if (formattedPhone.startsWith('0')) {
    formattedPhone = formattedPhone.substring(1);
  }
  if (!formattedPhone.startsWith('90')) {
    formattedPhone = `90${formattedPhone}`;
  }
  const message = `Merhaba! ${business.name} — ${product.name} hakkında bilgi almak istiyorum.`;
  const waUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

  return (
    <>
      <ProductJsonLd product={product} business={business} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-28 md:pb-12">
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
                  <span className="inline-block bg-red-100 text-red-600 text-[10px] font-black px-3 py-1 rounded-full mb-3 tracking-wider border border-red-200 uppercase">
                    KAMPANYA
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-3">
                  <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${
                    product.in_stock ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                  }`}>
                    {product.in_stock ? 'Stokta Mevcut' : 'Tükendi'}
                  </span>
                </div>
              </div>

              {/* Açıklama */}
              <div className="mb-8">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Ürün Hakkında</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                  {product.long_desc || product.short_desc || 'Bu ürün için henüz detaylı bir açıklama eklenmemiş.'}
                </p>
              </div>

              {/* Özellikler Tablosu */}
              {attributes && attributes.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Özellikler</h3>
                  <AttributeTable attributes={attributes} />
                </div>
              )}

              {/* Call to Action */}
              <div className="mt-auto pt-8 border-t border-gray-100">
                <a 
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xl py-5 rounded-2xl transition-all shadow-xl shadow-green-500/30 hover:-translate-y-1 active:scale-95"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" /><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z" /><path d="M9 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z" /><path d="M14 15a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1Z" /></svg>
                  WhatsApp'tan Bilgi Al
                </a>
                <p className="text-center text-xs text-gray-400 mt-4 font-bold uppercase tracking-tighter">
                  Fiyat bilgisi ve sipariş için WhatsApp üzerinden iletişime geçin.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <MobileStickyBar productName={product.name} waUrl={waUrl} inStock={product.in_stock} />
    </>
  );
}
