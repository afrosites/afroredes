"use client";

import React from 'react';
import { Card } from '@/components/ui/card';
import { Trophy } from 'lucide-react';

const Achievements = () => {
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Conquistas</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 text-center max-w-2xl">
        Aqui você pode acompanhar todas as suas conquistas e marcos alcançados em sua jornada!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Trophy className="h-12 w-12 text-yellow-500 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Primeiro Passo</h3>
          <p className="text-sm text-muted-foreground">Complete sua primeira missão com sucesso.</p>
          <span className="mt-4 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-xs font-medium">Concluído!</span>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Trophy className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Explorador Iniciante</h3>
          <p className="text-sm text-muted-foreground">Visite 3 novas áreas no mapa.</p>
          <span className="mt-4 px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-xs font-medium">Em Progresso</span>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <Trophy className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="font-semibold text-xl mb-2">Mestre Artesão</h3>
          <p className="text-sm text-muted-foreground">Crie 10 itens lendários.</p>
          <span className="mt-4 px-3 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded-full text-xs font-medium">Bloqueado</span>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;