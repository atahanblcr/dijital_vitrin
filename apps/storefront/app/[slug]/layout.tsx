import { notFound } from 'next/navigation';
import { getStorefrontData } from '../../lib/api';
import ThemeProvider from '../../components/layout/ThemeProvider';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import { Metadata } from 'next';
import { generateBaseMetadata } from '../../components/seo/generateMetadata';
import BusinessJsonLd from '../../components/seo/BusinessJsonLd';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  // Next.js 15 Fix
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const data = await getStorefrontData(slug);
  
  if (!data?.business) {
    return { title: 'Bulunamadı' };
  }
  
  const b = data.business;
  const description = b.about_text?.substring(0, 160) || b.slogan || `${b.name} dijital vitrini.`;
  const url = `https://${b.slug}.dijitalvitrin.com`;
  
  const baseMeta = generateBaseMetadata({
    title: b.name,
    description,
    image: b.logo_url || undefined,
    url,
    businessName: b.name,
  });

  return {
    ...baseMeta,
    title: {
      template: `%s | ${b.name}`,
      default: b.name,
    },
    icons: {
      icon: b.logo_url || '/favicon.ico',
    },
  };
}

export default async function StorefrontLayout({ children, params }: any) {
  // Next.js 15 Fix
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const data = await getStorefrontData(slug);

  if (!data?.business) {
    notFound();
  }

  const business = data.business;

  // Pasif işletme kontrolü
  if (!business.is_active) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 p-4 text-center">
        <div className="rounded-xl bg-white p-8 shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Site Geçici Olarak Kapalı</h1>
          <p className="text-gray-600">Bu işletmenin dijital vitrini şu anda aktif değildir.</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider 
      primaryColor={business.theme_primary} 
      accentColor={business.theme_accent}
    >
      <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 font-sans">
        <BusinessJsonLd business={business} />
        <Header business={business} />
        
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
        
        <Footer business={business} />
        <WhatsAppButton 
          phoneNumber={business.whatsapp} 
          businessName={business.name} 
        />
      </div>
    </ThemeProvider>
  );
}
