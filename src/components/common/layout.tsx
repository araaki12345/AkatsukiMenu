import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { SITE_TITLE } from '@/lib/constants';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

const Layout: FC<LayoutProps> = ({ children, title = SITE_TITLE }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="献立表管理システム" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">{SITE_TITLE}</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          &copy; 2024 {SITE_TITLE}. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Layout;