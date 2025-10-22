"use client";

import React from 'react';
import ShopDisplay from '@/components/ShopDisplay';

const Shop: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <ShopDisplay />
    </div>
  );
};

export default Shop;