"use client";

import React, { useState, useEffect } from 'react';
import CharacterSheet from '@/components/CharacterSheet';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Briefcase, ScrollText, Map, Store, User as UserIcon, Coins, Sparkles, Shield, Heart, BookOpen, MessageSquareText } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  class: string | null;
  level: number | null;
  current_xp: number | null;
  gold: number | null;
  status: string | null;
  gender: string | null;
  guilds: { name: string; id: string } | null;
}

const Game: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!isSessionLoading) {
      setLoadingProfile(false);
    }
  }, [user, isSessionLoading]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url, bio, class, level, current_xp, gold, status, gender, guilds(id, name)')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast.error("Erro ao carregar perfil: " + error.message);
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data as ProfileData);
    }
    setLoadingProfile(false);
  };

  if (isSessionLoading || loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-6xl mt-8">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Você precisa estar logado para ver seu status.</p>
        <Link to="/login">
          <Button variant="link" className="mt-4">Fazer Login</Button>
        </Link>
      </div>
    );
  }

  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Aventureiro';
  const displayAvatar = profile.avatar_url || user.user_metadata.avatar_url || 'https://github.com/shadcn.png';
  const currentLevel = profile.level || 1;
  const currentXp = profile.current_xp || 0;
  const xpToNextLevel = currentLevel * 100; // Exemplo simples de cálculo de XP para o próximo nível
  const xpPercentage = (currentXp / xpToNextLevel) * 100;

  // Exemplo de dados de combate (mantidos como dummy, pois não estão no perfil)
  const playerCombatStats = {
    name: displayName,
    level: currentLevel,
    health: 80,
    maxHealth: 100,
    attack: 15,
    defense: 10,
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">Status do Personagem</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Main Character Profile Card */}
        <Card className="lg:col-span-1 flex flex-col items-center text-center p-6">
          <Avatar className="h-28 w-28 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="text-5xl font-bold">
              <UserIcon className="h-16 w-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {displayName}
          </CardTitle>
          <p className="text-md text-muted-foreground">{user.email}</p>
          <Separator className="my-4 w-full" />
          <p className="text-center text-gray-700 dark:text-gray-300 text-lg mb-4">
            {profile.bio || "Nenhuma biografia definida. Visite seu perfil para adicionar uma!"}
          </p>
          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível:</p>
              <p className="text-xl font-semibold">{currentLevel}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classe:</p>
              <Badge variant="outline" className="text-lg font-semibold mt-1">{profile.class || 'Aventureiro'}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status:</p>
              <Badge variant="outline" className="text-lg font-semibold mt-1">{profile.status || 'Online'}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gênero:</p>
              <p className="text-xl font-semibold">{profile.gender || 'Não especificado'}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
              {profile.guilds ? (
                <Link to={`/game/guilds/${profile.guilds.id}`} className="text-xl font-semibold text-blue-500 hover:underline">
                  {profile.guilds.name}
                </Link>
              ) : (
                <p className="text-xl font-semibold">Nenhuma</p>
              )}
            </div>
          </div>
        </Card>

        {/* Character Combat Stats */}
        <div className="lg:col-span-1">
          <CharacterSheet {...playerCombatStats} />
        </div>

        {/* XP and Gold Display */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Progresso e Riqueza</CardTitle>
            <CardDescription>Seu caminho para a grandeza e seus tesouros.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Experiência: {currentXp}/{xpToNextLevel}</p>
              <Progress value={xpPercentage} className="w-full h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                Faltam {xpToNextLevel - currentXp} XP para o Nível {currentLevel + 1}
              </p>
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-yellow-600">
              <Coins className="h-7 w-7" />
              <span>Ouro: {profile.gold || 0}</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <Card className="w-full lg:col-span-3">
          <CardHeader>
            <CardTitle>Acesso Rápido</CardTitle>
            <CardDescription>Navegue rapidamente para as seções importantes do jogo.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </div>
    </div>
  );
};

export default Game;