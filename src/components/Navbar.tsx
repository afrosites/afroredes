"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Trophy, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-accent-foreground transition-colors">
          Meu RPG App
        </Link>
        <div className="space-x-4">
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" /> Início
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link to="/profile">
              <UserIcon className="mr-2 h-4 w-4" /> Perfil
            </Link>
          </Button>
          <Button variant="ghost" asChild className="text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
            <Link to="/achievements">
              <Trophy className="mr-2 h-4 w-4" /> Conquistas
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;