"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom'; // Importar Link

interface PlayerRanking {
  id: string;
  first_name: string | null;
  last_name: string | null;
  level: number;
  class: string | null;
  guilds: { id: string; name: string } | null; // Incluir ID da guilda
}

interface GuildRanking {
  id: string;
  name: string;
  description: string | null;
  member_count: number; // Will be calculated or fetched
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
      .select('id, first_name, last_name, level, class, guilds(id, name)') // Selecionar ID da guilda
      .order('level', { ascending: false })
      .limit(100); // Limit to top 100 players

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
    // For guild ranking, we'll fetch guilds and then count members
    const { data: guildsData, error: guildsError } = await supabase
      .from('guilds')
      .select('id, name, description');

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
      // Sort guilds by member count (descending)
      guildsWithMemberCount.sort((a, b) => b.member_count - a.member_count);
      setGuildRanking(guildsWithMemberCount as GuildRanking[]);
    }
    setLoadingGuilds(false);
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
              <CardTitle>Ranking de Jogadores</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPlayers ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : playerRanking.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhum jogador no ranking ainda.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Pos.</TableHead>
                      <TableHead>Nome</TableHead>
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
                          <Link to={`/game/profile/${player.id}`} className="text-blue-500 hover:underline">
                            {`${player.first_name || ''} ${player.last_name || ''}`.trim()}
                          </Link>
                        </TableCell>
                        <TableCell>{player.class || 'Aventureiro'}</TableCell>
                        <TableCell>{player.level}</TableCell>
                        <TableCell>
                          {player.guilds ? (
                            <Link to={`/game/guilds/${player.guilds.id}`} className="text-blue-500 hover:underline">
                              {player.guilds.name}
                            </Link>
                          ) : (
                            'Nenhuma'
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
              <CardTitle>Ranking de Guildas</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingGuilds ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : guildRanking.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma guilda no ranking ainda.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">Pos.</TableHead>
                      <TableHead>Nome da Guilda</TableHead>
                      <TableHead>Membros</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guildRanking.map((guild, index) => (
                      <TableRow key={guild.id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Link to={`/game/guilds/${guild.id}`} className="text-blue-500 hover:underline">
                            {guild.name}
                          </Link>
                        </TableCell>
                        <TableCell>{guild.member_count}</TableCell>
                        <TableCell>{guild.description || 'N/A'}</TableCell>
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