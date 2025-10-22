"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';

interface Guild {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  level: number; // Adicionado level
  member_count?: number;
}

const Guilds: React.FC = () => {
  const { user } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [isCreatingGuild, setIsCreatingGuild] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDescription, setNewGuildDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = async () => {
    setLoadingGuilds(true);
    const { data: guildsData, error: guildsError } = await supabase
      .from('guilds')
      .select('id, name, description, created_by, created_at, level'); // Selecionar level

    if (guildsError) {
      toast.error("Erro ao carregar guildas: " + guildsError.message);
      console.error("Error fetching guilds:", guildsError);
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
      setGuilds(guildsWithMemberCount);
    }
    setLoadingGuilds(false);
  };

  const handleCreateGuild = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para criar uma guilda.");
      return;
    }
    if (!newGuildName.trim()) {
      toast.error("O nome da guilda não pode ser vazio.");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('guilds')
      .insert({
        name: newGuildName.trim(),
        description: newGuildDescription.trim() || null,
        created_by: user.id,
        level: 1, // Nova guilda começa no nível 1
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast.error("Já existe uma guilda com este nome.");
      } else {
        toast.error("Erro ao criar guilda: " + error.message);
        console.error("Error creating guild:", error);
      }
    } else if (data) {
      toast.success(`Guilda "${data.name}" criada com sucesso!`);
      // Atualiza o perfil do criador para entrar na guilda e definir como Líder
      await supabase.from('profiles').update({ guild_id: data.id, guild_role: 'Líder' }).eq('id', user.id);
      fetchGuilds();
      setIsCreatingGuild(false);
      setNewGuildName('');
      setNewGuildDescription('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Guildas</h2>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Guildas Ativas</CardTitle>
            <CardDescription>Encontre ou crie sua guilda para se juntar a outros aventureiros.</CardDescription>
          </div>
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setIsCreatingGuild(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Guilda
                </Button>
              </TooltipTrigger>
              <TooltipContent>Crie sua própria guilda e convide amigos</TooltipContent>
            </Tooltip>
          )}
        </CardHeader>
        <CardContent>
          {loadingGuilds ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : guilds.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma guilda encontrada. Seja o primeiro a criar uma!</p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-4">
                {guilds.map((guild) => (
                  <Card key={guild.id} className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="text-lg font-semibold">{guild.name}</h3>
                      <p className="text-sm text-muted-foreground">{guild.description || 'Nenhuma descrição.'}</p>
                      <p className="text-xs text-muted-foreground mt-1">Membros: {guild.member_count || 0} | Nível: {guild.level}</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link to={`/game/guilds/${guild.id}`}>
                          <Button variant="outline" disabled={!user}>
                            Ver Detalhes
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Veja os detalhes desta guilda</TooltipContent>
                    </Tooltip>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Dialog open={isCreatingGuild} onOpenChange={setIsCreatingGuild}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Guilda</DialogTitle>
            <DialogDescription>
              Preencha os detalhes para criar sua própria guilda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guildName" className="text-right">
                Nome
              </Label>
              <Input
                id="guildName"
                value={newGuildName}
                onChange={(e) => setNewGuildName(e.target.value)}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="guildDescription" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="guildDescription"
                value={newGuildDescription}
                onChange={(e) => setNewGuildDescription(e.target.value)}
                className="col-span-3"
                placeholder="Uma breve descrição da sua guilda..."
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsCreatingGuild(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Descartar criação da guilda</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleCreateGuild} disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Guilda'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Confirmar criação da guilda</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guilds;