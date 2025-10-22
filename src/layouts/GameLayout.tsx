import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {!isMobile && <Sidebar />} {/* Desktop sidebar */}
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default GameLayout;