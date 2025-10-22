import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
  children: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Inicia aberto em desktop, fechado em mobile

  // Atualiza sidebarOpen quando o estado mobile muda
  React.useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <div className="flex flex-1">
        {/* Sidebar é renderizado condicionalmente e animado */}
        <div className={cn(
          "fixed top-16 left-0 h-[calc(100vh-4rem)] flex-shrink-0 z-30 transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden"
        )}>
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        <main className={cn(
          "flex-1 p-4 md:p-8 transition-all duration-300 ease-in-out",
          !isMobile && sidebarOpen ? "md:ml-64" : "md:ml-0"
        )}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default GameLayout;