import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CharacterSheetProps {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({
  name,
  level,
  health,
  maxHealth,
  attack,
  defense,
}) => {
  const healthPercentage = (health / maxHealth) * 100;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Nível: {level}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Saúde: {health}/{maxHealth}</p>
          <Progress value={healthPercentage} className="w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <p className="text-sm text-muted-foreground">Ataque: <span className="font-medium text-foreground">{attack}</span></p>
          <p className="text-sm text-muted-foreground">Defesa: <span className="font-medium text-foreground">{defense}</span></p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CharacterSheet;