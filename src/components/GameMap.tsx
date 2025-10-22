"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  description: string;
  x: number; // Percentage for positioning
  y: number; // Percentage for positioning
}

const locations: Location[] = [
  { id: '1', name: 'Vila do Bosque', description: 'Um vilarejo pacífico no coração da floresta.', x: 20, y: 30 },
  { id: '2', name: 'Montanhas Sombrias', description: 'Picos rochosos e perigosos, lar de feras selvagens.', x: 70, y: 15 },
  { id: '3', name: 'Ruínas Antigas', description: 'Restos de uma civilização esquecida, cheios de mistérios.', x: 45, y: 60 },
  { id: '4', name: 'Floresta Sussurrante', description: 'Uma floresta densa onde os ventos contam segredos.', x: 10, y: 70 },
  { id: '5', name: 'Deserto Ardente', description: 'Vastas dunas de areia e calor implacável.', x: 85, y: 80 },
];

const GameMap: React.FC = () => {
  const [currentLocation, setCurrentLocation] = React.useState<string | null>(locations[0].id);

  const handleLocationClick = (locationId: string) => {
    setCurrentLocation(locationId);
    // Em um jogo real, isso acionaria navegação, eventos, etc.
    console.log(`Viajando para: ${locations.find(loc => loc.id === locationId)?.name}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Mapa do Mundo</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[500px] bg-gradient-to-br from-green-700 to-green-900 rounded-md overflow-hidden border border-gray-700">
        {/* Fundo simples para simular terreno */}
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: "url('/placeholder.svg')" }}></div>
        <div className="absolute inset-0 flex items-center justify-center text-white text-opacity-50 text-6xl font-bold pointer-events-none">
          Mundo RPG
        </div>

        {locations.map((loc) => (
          <Button
            key={loc.id}
            variant={currentLocation === loc.id ? "default" : "secondary"}
            size="sm"
            className="absolute flex items-center gap-1"
            style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => handleLocationClick(loc.id)}
          >
            <MapPin className="h-4 w-4" />
            {loc.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default GameMap;