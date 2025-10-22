import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils'; // Importar cn para combinar classes

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {!isMobile && (
          <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 flex-shrink-0 z-30"> {/* Sidebar fixo */}
            <Sidebar />
          </div>
        )}
        <main className={cn("flex-1 p-4 md:p-8", !isMobile && "md:ml-64")}> {/* Conteúdo principal com margem para o sidebar */}
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default GameLayout;