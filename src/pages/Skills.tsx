import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Sword, Shield, Heart, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'active' | 'passive' | 'magic';
  level: number;
  icon: React.ElementType;
}

const dummySkills: Skill[] = [
  { id: '1', name: 'Ataque Poderoso', description: 'Um golpe forte que causa dano extra.', type: 'active', level: 5, icon: Sword },
  { id: '2', name: 'Defesa Robusta', description: 'Aumenta sua defesa por um curto período.', type: 'active', level: 3, icon: Shield },
  { id: '3', name: 'Regeneração Natural', description: 'Passivamente recupera uma pequena quantidade de vida ao longo do tempo.', type: 'passive', level: 2, icon: Heart },
  { id: '4', name: 'Bola de Fogo', description: 'Lança uma bola de fogo nos inimigos, causando dano mágico.', type: 'magic', level: 7, icon: Zap },
  { id: '5', name: 'Mestre Espadachim', description: 'Aumenta permanentemente o dano de todas as armas de espada.', type: 'passive', level: 4, icon: Sword },
  { id: '6', name: 'Cura Leve', description: 'Cura uma pequena quantidade de pontos de vida de um aliado.', type: 'magic', level: 3, icon: Heart },
];

const Skills: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Habilidades</h2>
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Suas Habilidades</CardTitle>
          <CardDescription>Gerencie suas habilidades ativas e passivas, e suas magias.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid gap-4">
              {dummySkills.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma habilidade encontrada. Comece sua jornada para aprender novas!</p>
              ) : (
                dummySkills.map((skill) => {
                  const Icon = skill.icon;
                  return (
                    <Card key={skill.id} className="flex items-center p-4">
                      <Icon className="h-8 w-8 mr-4 text-primary" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {skill.name}
                          <Badge variant="outline" className="capitalize">{skill.type}</Badge>
                        </h3>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                      <Badge variant="secondary" className="ml-4">Nível {skill.level}</Badge>
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

export default Skills;