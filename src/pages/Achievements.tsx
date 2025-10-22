"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trophy, CheckCircle2, Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Achievement {
  id: string;
  title: string;
  description: string;
  reward_xp: number;
  status: 'completed' | 'in_progress' | 'locked';
  progress?: number; // 0-100 for in_progress
  icon: React.ElementType;
}

const dummyAchievements: Achievement[] = [
  { id: '1', title: 'Primeiro Passo', description: 'Complete sua primeira missão.', reward_xp: 50, status: 'completed', icon: Trophy },
  { id: '2', title: 'Explorador Iniciante', description: 'Visite 3 locais diferentes no mapa.', reward_xp: 100, status: 'in_progress', progress: 66, icon: Star },
  { id: '3', title: 'Mestre Artesão', description: 'Crie 5 itens na forja.', reward_xp: 200, status: 'locked', icon: Award },
  { id: '4', title: 'Vencedor de Duelos', description: 'Vença 10 duelos contra outros jogadores.', reward_xp: 300, status: 'in_progress', progress: 30, icon: Trophy },
  { id: '5', title: 'Amigo da Guilda', description: 'Junte-se a uma guilda.', reward_xp: 75, status: 'completed', icon: Award },
  { id: '6', title: 'Caçador de Tesouros', description: 'Encontre 3 tesouros escondidos.', reward_xp: 150, status: 'locked', icon: Star },
  { id: '7', title: 'Lenda Viva', description: 'Alcance o nível 50.', reward_xp: 1000, status: 'in_progress', progress: 10, icon: Trophy },
];

const Achievements: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Conquistas</h2>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" /> Suas Conquistas
          </CardTitle>
          <CardDescription>Acompanhe seu progresso e celebre suas vitórias!</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4">
              {dummyAchievements.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma conquista encontrada. Comece sua jornada para desbloqueá-las!</p>
              ) : (
                dummyAchievements.map((achievement) => {
                  const Icon = achievement.icon;
                  const isCompleted = achievement.status === 'completed';
                  const isInProgress = achievement.status === 'in_progress';
                  const isLocked = achievement.status === 'locked';

                  return (
                    <Card 
                      key={achievement.id} 
                      className={`flex flex-col sm:flex-row items-start sm:items-center p-4 
                                  ${isCompleted ? 'border-green-500/50 bg-green-500/10' : ''}
                                  ${isLocked ? 'opacity-70 grayscale' : ''}`}
                    >
                      <Icon className={`h-8 w-8 mr-4 ${isCompleted ? 'text-green-500' : isInProgress ? 'text-blue-500' : 'text-muted-foreground'}`} />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {achievement.title}
                          {isCompleted && <Badge variant="secondary" className="bg-green-500 text-white">Concluída</Badge>}
                          {isInProgress && <Badge variant="secondary" className="bg-blue-500 text-white">Em Progresso</Badge>}
                          {isLocked && <Badge variant="secondary">Bloqueada</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                        {isInProgress && achievement.progress !== undefined && (
                          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                            <Progress value={achievement.progress} className="w-32 h-2" />
                            <span>{achievement.progress}%</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-4 text-right">
                        <p className="text-sm font-medium text-muted-foreground">Recompensa XP:</p>
                        <p className="text-lg font-semibold flex items-center justify-end gap-1">
                          {achievement.reward_xp} <Star className="h-4 w-4 text-yellow-500" />
                        </p>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Achievements;