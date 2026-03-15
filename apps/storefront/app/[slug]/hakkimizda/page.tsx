import { notFound } from 'next/navigation';
import { getStorefrontData } from '../../../lib/api';
import { Metadata } from 'next';
import { Clock, MapPin, Phone, Instagram, Facebook } from 'lucide-react';
import { formatWhatsAppNumber } from '../../../../../packages/shared/utils/whatsapp';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const resolvedParams = await params;
  const data = await getStorefrontData(resolvedParams.slug);
  if (!data?.business) return { title: 'Hakkımızda' };
  
  return {
    title: `Hakkımızda | ${data.business.name}`,
    description: `${data.business.name} hakkında detaylı bilgi, çalışma saatleri ve iletişim kanalları.`,
  };
}

export default async function AboutPage({ params }: any) {
  const resolvedParams = await params;
  const data = await getStorefrontData(resolvedParams.slug);

  if (!data?.business) {
    notFound();
  }

  const { business } = data;
  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">Hakkımızda</h1>
        <div className="w-24 h-2 bg-[var(--color-primary)] mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        
        {/* İşletme Hikayesi */}
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-sm font-bold">01</span>
              Hikayemiz
            </h2>
            <div className="prose prose-gray prose-lg">
              <p className="text-gray-600 leading-relaxed font-medium">
                {business.about_text || `${business.name} olarak müşterilerimize en kaliteli hizmeti sunmak için buradayız. Ürünlerimizi inceleyebilir ve bizimle WhatsApp üzerinden iletişime geçebilirsiniz.`}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center text-sm font-bold">02</span>
              İletişim
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                  <Phone size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter">WhatsApp Hattımız</p>
                  <p className="text-lg font-black text-gray-900">{business.whatsapp}</p>
                </div>
              </div>

              {(business.instagram_url || business.facebook_url) && (
                <div className="flex gap-4">
                  {business.instagram_url && (
                    <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-pink-200 hover:text-pink-600 transition-all group">
                      <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Instagram</span>
                    </a>
                  )}
                  {business.facebook_url && (
                    <a href={business.facebook_url} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 hover:text-blue-600 transition-all group">
                      <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                      <span className="font-bold">Facebook</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Çalışma Saatleri ve Konum */}
        <div className="space-y-8">
          <section className="bg-gray-900 text-white p-8 rounded-[40px] shadow-2xl">
            <h2 className="text-2xl font-black mb-6 uppercase tracking-widest flex items-center gap-3">
              <Clock size={28} className="text-[var(--color-primary)]" />
              Çalışma Saatleri
            </h2>
            <div className="space-y-3">
              {business.hours && business.hours.length > 0 ? (
                business.hours.sort((a: any, b: any) => (a.day_of_week === 0 ? 7 : a.day_of_week) - (b.day_of_week === 0 ? 7 : b.day_of_week)).map((h: any) => (
                  <div key={h.id} className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0">
                    <span className="font-bold text-gray-400">{days[h.day_of_week === 0 ? 6 : h.day_of_week - 1]}</span>
                    <span className={`font-black ${h.is_open ? 'text-white' : 'text-red-400'}`}>
                      {h.is_open ? `${h.open_time?.substring(0, 5)} - ${h.close_time?.substring(0, 5)}` : 'Kapalı'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 italic">Çalışma saatleri belirtilmemiş.</p>
              )}
            </div>
          </section>

          {business.maps_url && (
            <section>
              <h2 className="text-2xl font-black text-gray-900 mb-4 uppercase tracking-widest flex items-center gap-3">
                <MapPin size={28} className="text-red-500" />
                Konum
              </h2>
              <div className="rounded-[40px] overflow-hidden border-4 border-white shadow-xl aspect-video bg-gray-100 flex items-center justify-center">
                 <a 
                  href={business.maps_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white px-8 py-3 rounded-2xl font-black text-gray-900 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  Haritalarda Görüntüle
                </a>
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
}
