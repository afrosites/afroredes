import React from 'react';
import CharacterSheet from '@/components/CharacterSheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex flex-col items-center justify-center"> {/* Ajustado para o layout */}
      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Bem-vindo ao RPG!</h1>
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
            <CardTitle>Missões</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhuma missão ativa.</p>
          </CardContent>
        </Card>
      </div>
      {/* MadeWithDyad removido daqui, agora está no Footer */}
    </div>
  );
};

export default Game;