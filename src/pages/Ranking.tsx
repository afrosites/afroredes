"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User as UserIcon, Shield, Users, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface PlayerRanking {
  id: string;
  first_name: string | null;
  last_name: string | null;
  level: number;
  class: string | null;
  avatar_url: string | null; // Adicionado avatar_url
  guilds: { id: string; name: string } | null;
}

interface GuildRanking {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  level: number;
  avatar_url: string | null; // Adicionado avatar_url
}

const Ranking: React.FC = () => {
  const [playerRanking, setPlayerRanking] = useState<PlayerRanking[]>([]);
  const [guildRanking, setGuildRanking] = useState<GuildRanking[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [loadingGuilds, setLoadingGuilds] = useState(true);

  useEffect(() => {
    fetchPlayerRanking();
    fetchGuildRanking();
  }, []);

  const fetchPlayerRanking = async () => {
    setLoadingPlayers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, level, class, avatar_url, guilds(id, name)') // Incluir avatar_url
      .order('level', { ascending: false })
      .limit(100);

    if (error) {
      toast.error("Erro ao carregar ranking de jogadores: " + error.message);
      console.error("Error fetching player ranking:", error);
    } else if (data) {
      setPlayerRanking(data as PlayerRanking[]);
    }
    setLoadingPlayers(false);
  };

  const fetchGuildRanking = async () => {
    setLoadingGuilds(true);
    const { data: guildsData, error: guildsError } = await supabase
      .from('guilds')
      .select('id, name, description, level, avatar_url'); // Incluir avatar_url

    if (guildsError) {
      toast.error("Erro ao carregar ranking de guildas: " + guildsError.message);
      console.error("Error fetching guild ranking:", guildsError);
      setLoadingGuilds(false);
      return;
    }

    if (guildsData) {
      const guildsWithMemberCount = await Promise.all(
        guildsData.map(async (guild) => {
          const { count, error: countError } = await supabase
            .from('profiles')
            .select('id', { count: 'exact' })
            .eq('guild_id', guild.id);

          if (countError) {
            console.error(`Error counting members for guild ${guild.name}:`, countError);
            return { ...guild, member_count: 0 };
          }
          return { ...guild, member_count: count || 0 };
        })
      );
      // Sort guilds by level first, then by member count (descending)
      guildsWithMemberCount.sort((a, b) => {
        if (b.level !== a.level) {
          return b.level - a.level;
        }
        return b.member_count - a.member_count;
      });
      setGuildRanking(guildsWithMemberCount as GuildRanking[]);
    }
    setLoadingGuilds(false);
  };

  const getPlayerDisplayName = (player: PlayerRanking) => {
    return `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Aventureiro Desconhecido';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Ranking Global</h2>

      <Tabs defaultValue="players" className="w-full max-w-4xl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="players">Jogadores</TabsTrigger>
          <TabsTrigger value="guilds">Guildas</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" /> Ranking de Jogadores
              </CardTitle>
              <CardDescription>Os aventureiros mais poderosos do reino.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingPlayers ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : playerRanking.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum jogador no ranking ainda.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Pos.</TableHead>
                      <TableHead>Jogador</TableHead>
                      <TableHead>Classe</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Guilda</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playerRanking.map((player, index) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Link to={`/game/profile/${player.id}`} className="flex items-center gap-3 text-blue-500 hover:underline">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={player.avatar_url || 'https://github.com/shadcn.png'} alt={getPlayerDisplayName(player)} />
                              <AvatarFallback>{getPlayerDisplayName(player).charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{getPlayerDisplayName(player)}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.class || 'Aventureiro'}</Badge>
                        </TableCell>
                        <TableCell className="font-bold">{player.level}</TableCell>
                        <TableCell>
                          {player.guilds ? (
                            <Link to={`/game/guilds/${player.guilds.id}`} className="text-blue-500 hover:underline">
                              {player.guilds.name}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">Nenhuma</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="guilds">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" /> Ranking de Guildas
              </CardTitle>
              <CardDescription>As guildas mais influentes e poderosas do reino.</CardDescription>
            </CardHeader>
            <CardContent>
              {loadingGuilds ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : guildRanking.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma guilda no ranking ainda.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Pos.</TableHead>
                      <TableHead>Guilda</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Membros</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guildRanking.map((guild, index) => (
                      <TableRow key={guild.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Link to={`/game/guilds/${guild.id}`} className="flex items-center gap-3 text-blue-500 hover:underline">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={guild.avatar_url || 'https://github.com/shadcn.png'} alt={guild.name} />
                              <AvatarFallback>{guild.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-semibold">{guild.name}</span>
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> {guild.level}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4 text-muted-foreground" /> {guild.member_count}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>Total de membros na guilda</TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell className="text-muted-foreground max-w-[200px] truncate">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span>{guild.description || 'N/A'}</span>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{guild.description || 'Nenhuma descrição.'}</TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ranking;