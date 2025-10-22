"use client";

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { MadeWithDyad } from './made-with-dyad'; // Import MadeWithDyad

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto p-4">
        <Outlet />
      </main>
      <MadeWithDyad /> {/* Adicionado ao final do layout */}
    </div>
  );
};

export default MainLayout;