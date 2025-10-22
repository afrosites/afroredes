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
import { PlusCircle, Image as ImageIcon, Users, Star } from 'lucide-react'; // Adicionado Users e Star
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from 'react-router-dom';
import AvatarGallery from '@/components/AvatarGallery'; // Importar AvatarGallery
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Importar Avatar
import { Badge } from '@/components/ui/badge'; // Importar Badge

interface Guild {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  level: number;
  member_count?: number;
  avatar_url: string | null; // Adicionado avatar_url
}

const Guilds: React.FC = () => {
  const { user } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(true);
  const [isCreatingGuild, setIsCreatingGuild] = useState(false);
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildDescription, setNewGuildDescription] = useState('');
  const [newGuildAvatarUrl, setNewGuildAvatarUrl] = useState<string | null>(null); // Estado para o avatar da guilda
  const [isAvatarGalleryOpen, setIsAvatarGalleryOpen] = useState(false); // Estado para a galeria de avatares
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGuilds();
  }, []);

  const fetchGuilds = async () => {
    setLoadingGuilds(true);
    const { data: guildsData, error: guildsError } = await supabase
      .from('guilds')
      .select('id, name, description, created_by, created_at, level, avatar_url'); // Selecionar avatar_url

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
        level: 1,
        avatar_url: newGuildAvatarUrl, // Salvar o avatar selecionado
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
      await supabase.from('profiles').update({ guild_id: data.id, guild_role: 'Líder' }).eq('id', user.id);
      fetchGuilds();
      setIsCreatingGuild(false);
      setNewGuildName('');
      setNewGuildDescription('');
      setNewGuildAvatarUrl(null); // Resetar avatar
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
                  <Card key={guild.id} className="flex flex-col sm:flex-row items-center justify-between p-4">
                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={guild.avatar_url || 'https://github.com/shadcn.png'} alt={guild.name} />
                        <AvatarFallback className="text-xl font-bold">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h3 className="text-xl font-semibold">{guild.name}</h3>
                        <p className="text-sm text-muted-foreground">{guild.description || 'Nenhuma descrição.'}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3" /> Nível {guild.level}
                          </Badge>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Users className="h-3 w-3" /> {guild.member_count || 0} Membros
                          </Badge>
                        </div>
                      </div>
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Avatar</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={newGuildAvatarUrl || 'https://github.com/shadcn.png'} alt="Guild Avatar" />
                  <AvatarFallback>
                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => setIsAvatarGalleryOpen(true)} disabled={isSubmitting}>
                  Selecionar Avatar
                </Button>
              </div>
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

      <AvatarGallery
        isOpen={isAvatarGalleryOpen}
        onClose={() => setIsAvatarGalleryOpen(false)}
        onSelectAvatar={(url) => {
          setNewGuildAvatarUrl(url);
          setIsAvatarGalleryOpen(false);
        }}
        selectedAvatarUrl={newGuildAvatarUrl}
      />
    </div>
  );
};

export default Guilds;