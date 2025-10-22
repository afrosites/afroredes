"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, ArrowLeft, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

interface PlayerProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  class: string | null;
  level: number | null;
  guilds: { id: string; name: string } | null; // Incluir ID da guilda
  status: string | null;
  gender: string | null;
  guild_role: string | null;
}

const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [playerProfile, setPlayerProfile] = useState<PlayerProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPlayerProfile(id);
    }
  }, [id]);

  const fetchPlayerProfile = async (playerId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, bio, class, level, guilds(id, name), status, gender, guild_role')
      .eq('id', playerId)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast.error("Erro ao carregar perfil do jogador: " + error.message);
      console.error("Error fetching player profile:", error);
    } else if (data) {
      setPlayerProfile(data as PlayerProfileData);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Skeleton className="h-24 w-24 rounded-full mb-4" />
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-32 mb-6" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
        <Skeleton className="h-4 w-full max-w-md mb-4" />
      </div>
    );
  }

  if (!playerProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Perfil do jogador não encontrado.</p>
        <Link to="/game/ranking">
          <Button variant="link" className="mt-4">Voltar para o Ranking</Button>
        </Link>
      </div>
    );
  }

  const displayName = `${playerProfile.first_name || ''} ${playerProfile.last_name || ''}`.trim() || 'Aventureiro Desconhecido';
  const displayAvatar = playerProfile.avatar_url || 'https://github.com/shadcn.png';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl mb-6 flex justify-between items-center">
        <Link to="/game/ranking"> {/* Pode ser ajustado para voltar à página anterior */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar</TooltipContent>
          </Tooltip>
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Perfil do Jogador</h2>
        <div></div> {/* Placeholder for alignment */}
      </div>

      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
          <p className="text-muted-foreground">{playerProfile.status || 'Offline'}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-700 dark:text-gray-300">
            {playerProfile.bio || "Nenhuma biografia definida."}
          </p>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível:</p>
              <p className="text-lg font-semibold">{playerProfile.level || 1}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classe:</p>
              <p className="text-lg font-semibold">{playerProfile.class || 'Aventureiro'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gênero:</p>
              <p className="text-lg font-semibold">{playerProfile.gender || 'Não especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
              {playerProfile.guilds ? (
                <Link to={`/game/guilds/${playerProfile.guilds.id}`} className="text-lg font-semibold text-blue-500 hover:underline">
                  {playerProfile.guilds.name}
                </Link>
              ) : (
                <p className="text-lg font-semibold">Nenhuma</p>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cargo na Guilda:</p>
              <Badge variant="outline" className={playerProfile.guild_role === 'Líder' ? 'bg-yellow-500 text-white' : ''}>
                {playerProfile.guild_role || 'Nenhum'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerProfile;