import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ScrollObserver from '@/components/ScrollObserver';

export const metadata: Metadata = {
  title: 'GKB Textiles | Premium Cotton Grey Fabric Manufacturer | Erode, Tamil Nadu',
  description:
    'GKB Textiles - Leading manufacturer and exporter of premium cotton grey fabrics using advanced Picanol Air Jet Loom technology. Based in Erode, Tamil Nadu, India.',
  keywords: [
    'cotton grey fabric',
    'textile manufacturer',
    'Picanol Air Jet Loom',
    'Erode textiles',
    'dobby fabrics',
    'double cloth',
    'seersucker',
  ],
  authors: [{ name: 'GKB Textiles' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <ScrollObserver />
      </body>
    </html>
  );
}
