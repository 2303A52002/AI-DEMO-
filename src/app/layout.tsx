import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/frontend/components/layout/Providers';
import Navbar from '@/frontend/components/layout/Navbar';
import Footer from '@/frontend/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'CampusIQ | College Discovery, Placement Analytics & AI Predictor',
  description:
    'Discover premier Indian colleges, compare fee structures and placement averages, read student reviews, and predict admissions matches using the Groq AI predictor.',
  keywords: 'college discovery, compare colleges, admission predictor, IIT placements, Indian universities, engineering rankings',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased dark`}>
      <body className="h-full bg-[#070b13] text-slate-100 flex flex-col font-sans selection:bg-sky-500/20 selection:text-sky-300">
        <Providers>
          <Navbar />
          <main className="flex-grow flex flex-col">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
