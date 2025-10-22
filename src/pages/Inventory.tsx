import React from 'react';
import InventoryDisplay from '@/components/InventoryDisplay';
import { Sword, Shield, Gem, ScrollText, Flask } from 'lucide-react';

const dummyInventoryItems = [
  {
    id: '1',
    name: 'Espada Longa Enferrujada',
    description: 'Uma espada antiga e enferrujada, mas ainda capaz de causar algum dano. +5 Ataque.',
    quantity: 1,
    type: 'weapon',
    icon: Sword,
  },
  {
    id: '2',
    name: 'Escudo de Madeira',
    description: 'Um escudo simples feito de madeira. Oferece proteção básica. +3 Defesa.',
    quantity: 1,
    type: 'armor',
    icon: Shield,
  },
  {
    id: '3',
    name: 'Poção de Cura Menor',
    description: 'Restaura uma pequena quantidade de pontos de vida. Use com sabedoria!',
    quantity: 3,
    type: 'consumable',
    icon: Flask,
  },
  {
    id: '4',
    name: 'Gema Brilhante',
    description: 'Uma gema que brilha suavemente. Pode ser vendida por algumas moedas de ouro.',
    quantity: 5,
    type: 'misc',
    icon: Gem,
  },
  {
    id: '5',
    name: 'Pergaminho Antigo',
    description: 'Um pergaminho com escrituras ilegíveis. Parece ser parte de uma missão.',
    quantity: 1,
    type: 'quest',
    icon: ScrollText,
  },
  {
    id: '6',
    name: 'Armadura de Couro',
    description: 'Uma armadura leve e flexível, ideal para aventureiros ágeis. +7 Defesa.',
    quantity: 1,
    type: 'armor',
    icon: Shield,
  },
  {
    id: '7',
    name: 'Poção de Mana',
    description: 'Restaura uma pequena quantidade de pontos de mana.',
    quantity: 2,
    type: 'consumable',
    icon: Flask,
  },
];

const Inventory: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <InventoryDisplay items={dummyInventoryItems} />
    </div>
  );
};

export default Inventory;