import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ToastContainer } from '@/components/Toast';
import { AuthModal } from '@/components/AuthModal';

export const metadata: Metadata = {
  title: 'Kharidari.pk — Pakistan ka Online Bazaar | پاکستان کا آن لائن بازار',
  description: 'Pakistan ka sabse bada multi-vendor marketplace. Mobiles, kapray, jewellery, fruits, watches — sab kuch ek jagah. JazzCash, Easypaisa, COD, SadaPay se payment karein. TCS, Leopard, Trax delivery.',
  keywords: 'Pakistan online shopping, kharidari, marketplace, JazzCash, Easypaisa, COD, online bazaar, Daraz alternative',
  openGraph: {
    title: 'Kharidari.pk — Pakistan ka Online Bazaar',
    description: 'Pakistan ka sabse bada multi-vendor marketplace',
    siteName: 'Kharidari.pk',
    locale: 'ur_PK',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ur">
      <body className="min-h-screen flex flex-col bg-hero-gradient font-sans antialiased text-slate-900 selection:bg-orange-200 selection:text-orange-800">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <ToastContainer />
        <AuthModal />
      </body>
    </html>
  );
}
