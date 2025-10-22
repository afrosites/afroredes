import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon } from 'lucide-react';

const Profile: React.FC = () => {
  // Exemplo de dados do perfil do usuário
  const userProfile = {
    name: "Aventureiro Destemido",
    email: "aventureiro@rpg.com",
    avatarUrl: "https://github.com/shadcn.png", // Exemplo de avatar
    bio: "Um bravo explorador em busca de glória e tesouros. Mestre em espadas e magias arcanas.",
    level: 15,
    class: "Guerreiro Mago",
    guild: "Ordem dos Dragões",
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Meu Perfil</h2>
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={userProfile.avatarUrl} alt={userProfile.name} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{userProfile.name}</CardTitle>
          <p className="text-muted-foreground">{userProfile.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700 dark:text-gray-300">{userProfile.bio}</p>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível:</p>
              <p className="text-lg font-semibold">{userProfile.level}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classe:</p>
              <p className="text-lg font-semibold">{userProfile.class}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
              <p className="text-lg font-semibold">{userProfile.guild}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;