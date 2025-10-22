"use client";

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Crown, ArrowLeft } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GuildData {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

interface GuildMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  level: number | null;
  class: string | null;
  status: string | null;
}

const GuildProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isSessionLoading } = useSession();
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGuildDetails(id);
    }
  }, [id, user, isSessionLoading]);

  const fetchGuildDetails = async (guildId: string) => {
    setLoading(true);
    // Fetch guild data
    const { data: guildData, error: guildError } = await supabase
      .from('guilds')
      .select('*')
      .eq('id', guildId)
      .single();

    if (guildError) {
      toast.error("Erro ao carregar detalhes da guilda: " + guildError.message);
      console.error("Error fetching guild details:", guildError);
      setLoading(false);
      return;
    }
    setGuild(guildData);

    // Fetch guild members
    const { data: membersData, error: membersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, level, class, status')
      .eq('guild_id', guildId)
      .order('level', { ascending: false });

    if (membersError) {
      toast.error("Erro ao carregar membros da guilda: " + membersError.message);
      console.error("Error fetching guild members:", membersError);
    } else if (membersData) {
      setMembers(membersData);
      if (user) {
        setIsMember(membersData.some(member => member.id === user.id));
      }
    }
    setLoading(false);
  };

  const handleJoinGuild = async () => {
    if (!user || !guild) {
      toast.error("Você precisa estar logado para entrar em uma guilda.");
      return;
    }

    setIsJoining(true);
    const { error } = await supabase
      .from('profiles')
      .update({ guild_id: guild.id })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao entrar na guilda: " + error.message);
      console.error("Error joining guild:", error);
    } else {
      toast.success(`Você entrou na guilda "${guild.name}"!`);
      setIsMember(true);
      if (id) fetchGuildDetails(id); // Refresh data
    }
    setIsJoining(false);
  };

  const handleLeaveGuild = async () => {
    if (!user || !guild) {
      toast.error("Você precisa estar logado para sair de uma guilda.");
      return;
    }

    setIsJoining(true); // Reusing for loading state
    const { error } = await supabase
      .from('profiles')
      .update({ guild_id: null })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao sair da guilda: " + error.message);
      console.error("Error leaving guild:", error);
    } else {
      toast.success(`Você saiu da guilda "${guild.name}".`);
      setIsMember(false);
      if (id) fetchGuildDetails(id); // Refresh data
    }
    setIsJoining(false);
  };

  if (loading || isSessionLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Skeleton className="h-64 w-full max-w-4xl mb-4" />
        <Skeleton className="h-96 w-full max-w-4xl" />
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Guilda não encontrada.</p>
        <Link to="/game/guilds">
          <Button variant="link" className="mt-4">Voltar para Guildas</Button>
        </Link>
      </div>
    );
  }

  const getMemberDisplayName = (member: GuildMember) => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Aventureiro';
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mb-6 flex justify-between items-center">
        <Link to="/game/guilds">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar para a lista de Guildas</TooltipContent>
          </Tooltip>
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Perfil da Guilda</h2>
        <div></div> {/* Placeholder for alignment */}
      </div>

      <Card className="w-full max-w-4xl mb-8">
        <CardHeader className="flex flex-col items-center text-center">
          <Crown className="h-16 w-16 mb-4 text-yellow-500" />
          <CardTitle className="text-4xl font-extrabold">{guild.name}</CardTitle>
          <CardDescription className="text-lg mt-2">{guild.description || 'Nenhuma descrição fornecida.'}</CardDescription>
          <p className="text-sm text-muted-foreground mt-2">Membros: {members.length}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />
          <div className="flex justify-center">
            {user && (
              isMember ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="destructive" onClick={handleLeaveGuild} disabled={isJoining}>
                      {isJoining ? 'Saindo...' : 'Sair da Guilda'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sair desta guilda</TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleJoinGuild} disabled={isJoining}>
                      {isJoining ? 'Entrando...' : 'Entrar na Guilda'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Juntar-se a esta guilda</TooltipContent>
                </Tooltip>
              )
            )}
            {!user && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button disabled>Faça login para interagir</Button>
                </TooltipTrigger>
                <TooltipContent>Você precisa estar logado para entrar ou sair de guildas</TooltipContent>
              </Tooltip>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Membros da Guilda ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Esta guilda ainda não tem membros.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Classe</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar_url || 'https://github.com/shadcn.png'} alt={getMemberDisplayName(member)} />
                          <AvatarFallback>{getMemberDisplayName(member).charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{getMemberDisplayName(member)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.class || 'Aventureiro'}</TableCell>
                    <TableCell>{member.level || 1}</TableCell>
                    <TableCell>{member.status || 'Offline'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuildProfile;