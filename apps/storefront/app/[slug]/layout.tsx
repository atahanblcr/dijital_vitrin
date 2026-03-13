import { notFound } from 'next/navigation';
import { getStorefrontData } from '../../lib/api';
import ThemeProvider from '../../components/layout/ThemeProvider';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import WhatsAppButton from '../../components/ui/WhatsAppButton';
import { Metadata } from 'next';

interface LayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const data = await getStorefrontData(params.slug);
  
  if (!data?.business) {
    return { title: 'Bulunamadı' };
  }
  
  const b = data.business;
  return {
    title: {
      template: `%s | ${b.name}`,
      default: b.name,
    },
    description: b.about_text?.substring(0, 160) || `${b.name} dijital vitrini.`,
    icons: {
      icon: b.logo_url || '/favicon.ico',
    },
  };
}

export default async function StorefrontLayout({ children, params }: LayoutProps) {
  const data = await getStorefrontData(params.slug);

  if (!data?.business) {
    notFound();
  }

  const business = data.business;

  // Pasif işletme kontrolü
  if (!business.is_active) {
    // API should ideally handle this or we handle it here
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
