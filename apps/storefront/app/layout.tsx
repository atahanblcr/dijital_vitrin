import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: {
    template: '%s | Dijital Vitrin',
    default: 'Dijital Vitrin',
  },
  description: 'Küçük ve orta ölçekli işletmeler için dijital vitrin çözümleri.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
