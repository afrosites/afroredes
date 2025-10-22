import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm py-4 text-center text-sm text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Feito com amor por Afro Sites</p>
    </footer>
  );
};