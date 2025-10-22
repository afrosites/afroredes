import React from 'react';
import { MadeWithDyad } from '@/components/made-with-dyad';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm py-4 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} RPG Game. Todos os direitos reservados.</p>
      <MadeWithDyad />
    </footer>
  );
};