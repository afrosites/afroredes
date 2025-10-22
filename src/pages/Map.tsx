"use client";

import React from 'react';
import GameMap from '@/components/GameMap';

const Map: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <GameMap />
    </div>
  );
};

export default Map;