import React from 'react';
import CharacterSheet from '@/components/CharacterSheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, ScrollText, Map, Store } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Bem-vindo ao RPG!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Character Sheet */}
        <div className="lg:col-span-1">
          <CharacterSheet {...playerCharacter} />
        </div>

        {/* Quick Access Cards */}
        <Card className="w-full lg:col-span-2">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>Navegue rapidamente para as seções importantes do jogo.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/game/inventory">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                <Briefcase className="h-8 w-8 mb-2" />
                Inventário
              </Button>
            </Link>
            <Link to="/game/quests">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                <ScrollText className="h-8 w-8 mb-2" />
                Missões
              </Button>
            </Link>
            <Link to="/game/map">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                <Map className="h-8 w-8 mb-2" />
                Mapa
              </Button>
            </Link>
            <Link to="/game/shop">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center text-lg">
                <Store className="h-8 w-8 mb-2" />
                Loja
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Placeholder for Recent Activity/News */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Notícias e Atividades Recentes</CardTitle>
            <CardDescription>Fique por dentro das últimas novidades do mundo.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Nenhuma notícia recente. Continue explorando!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Game;