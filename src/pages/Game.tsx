import React from 'react';
import CharacterSheet from '@/components/CharacterSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// Removido import GameMap from '@/components/GameMap'; // Remover importação do GameMap

const Game: React.FC = () => {
  // Exemplo de dados do personagem
  const playerCharacter = {
    name: "Herói Aventureiro",
    level: 1,
    health: 80,
    maxHealth: 100,
    attack: 15,
    defense: 10,
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8"> {/* Ajustado para o layout */}
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Bem-vindo ao RPG!</h1>
      
      {/* GameMap foi movido para uma página separada e acessível pelo sidebar */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl">
        <CharacterSheet {...playerCharacter} />
        {/* Futuros componentes de inventário, missões, etc. */}
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Inventário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Seu inventário está vazio.</p>
          </CardContent>
        </Card>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Missões Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhuma missão ativa.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;