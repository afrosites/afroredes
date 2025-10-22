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
import { Users, Crown, ArrowLeft, Zap, Shield, Heart, Circle, Edit, Image as ImageIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AvatarGallery from '@/components/AvatarGallery';

interface GuildData {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  level: number;
  avatar_url: string | null; // Adicionado avatar_url
}

interface GuildMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  level: number | null;
  class: string | null;
  status: string | null;
  guild_role: string | null;
}

const dummyGuildSkills = [
  { id: 'gs1', name: 'Bônus de XP da Guilda', description: 'Todos os membros ganham 10% mais XP.', icon: Zap },
  { id: 'gs2', name: 'Defesa Coletiva', description: 'Aumenta a defesa de todos os membros em 5%.', icon: Shield },
  { id: 'gs3', name: 'Cura da Guilda', description: 'Membros regeneram vida mais rapidamente.', icon: Heart },
];

const GuildProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, isLoading: isSessionLoading } = useSession();
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [members, setMembers] = useState<GuildMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [userGuildRole, setUserGuildRole] = useState<string | null>(null);

  // State for editing guild
  const [isEditingGuild, setIsEditingGuild] = useState(false);
  const [editGuildName, setEditGuildName] = useState('');
  const [editGuildDescription, setEditGuildDescription] = useState('');
  const [editGuildAvatarUrl, setEditGuildAvatarUrl] = useState<string | null>(null);
  const [isAvatarGalleryOpen, setIsAvatarGalleryOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  useEffect(() => {
    if (id) {
      fetchGuildDetails(id);
    }
  }, [id, user, isSessionLoading]);

  const fetchGuildDetails = async (guildId: string) => {
    setLoading(true);
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
    setEditGuildName(guildData.name);
    setEditGuildDescription(guildData.description || '');
    setEditGuildAvatarUrl(guildData.avatar_url);

    const { data: membersData, error: membersError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, level, class, status, guild_role')
      .eq('guild_id', guildId)
      .order('level', { ascending: false });

    if (membersError) {
      toast.error("Erro ao carregar membros da guilda: " + membersError.message);
      console.error("Error fetching guild members:", membersError);
    } else if (membersData) {
      setMembers(membersData);
      if (user) {
        const currentUserMember = membersData.find(member => member.id === user.id);
        setIsMember(!!currentUserMember);
        setUserGuildRole(currentUserMember?.guild_role || null);
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
      .update({ guild_id: guild.id, guild_role: 'Membro' })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao entrar na guilda: " + error.message);
      console.error("Error joining guild:", error);
    } else {
      toast.success(`Você entrou na guilda "${guild.name}"!`);
      setIsMember(true);
      setUserGuildRole('Membro');
      if (id) fetchGuildDetails(id);
    }
    setIsJoining(false);
  };

  const handleLeaveGuild = async () => {
    if (!user || !guild) {
      toast.error("Você precisa estar logado para sair de uma guilda.");
      return;
    }

    setIsJoining(true);
    const { error } = await supabase
      .from('profiles')
      .update({ guild_id: null, guild_role: null })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao sair da guilda: " + error.message);
      console.error("Error leaving guild:", error);
    } else {
      toast.success(`Você saiu da guilda "${guild.name}".`);
      setIsMember(false);
      setUserGuildRole(null);
      if (id) fetchGuildDetails(id);
    }
    setIsJoining(false);
  };

  const handleUpdateGuild = async () => {
    if (!user || !guild) return;

    setIsSubmittingEdit(true);
    const { error } = await supabase
      .from('guilds')
      .update({
        name: editGuildName.trim(),
        description: editGuildDescription.trim() || null,
        avatar_url: editGuildAvatarUrl,
      })
      .eq('id', guild.id)
      .eq('created_by', user.id); // Only the creator can update

    if (error) {
      toast.error("Erro ao atualizar guilda: " + error.message);
      console.error("Error updating guild:", error);
    } else {
      toast.success("Guilda atualizada com sucesso!");
      if (id) fetchGuildDetails(id);
      setIsEditingGuild(false);
    }
    setIsSubmittingEdit(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !guild || !event.target.files || event.target.files.length === 0) {
      toast.error("Nenhum arquivo selecionado ou você não tem permissão.");
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${guild.id}-${Math.random()}.${fileExt}`; // Unique filename for this guild
    const filePath = `${fileName}`;

    setIsSubmittingEdit(true);
    const { data, error } = await supabase.storage
      .from('guild_avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      toast.error("Erro ao fazer upload do avatar: " + error.message);
      console.error("Error uploading avatar:", error);
      setIsSubmittingEdit(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from('guild_avatars')
      .getPublicUrl(filePath);

    if (publicUrlData?.publicUrl) {
      setEditGuildAvatarUrl(publicUrlData.publicUrl);
      toast.success("Avatar enviado com sucesso! Clique em 'Salvar' para aplicar.");
    } else {
      toast.error("Erro ao obter URL pública do avatar.");
    }
    setIsSubmittingEdit(false);
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

  const onlineMembers = members.filter(member => member.status === 'Online');
  const isGuildLeader = user && guild.created_by === user.id;

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
        {isGuildLeader && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={() => setIsEditingGuild(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar Guilda</TooltipContent>
          </Tooltip>
        )}
      </div>

      <Card className="w-full max-w-4xl mb-8">
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={guild.avatar_url || 'https://github.com/shadcn.png'} alt={guild.name} />
            <AvatarFallback>
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-4xl font-extrabold">{guild.name}</CardTitle>
          <CardDescription className="text-lg mt-2">{guild.description || 'Nenhuma descrição fornecida.'}</CardDescription>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-sm text-muted-foreground">Membros: {members.length}</p>
            <p className="text-sm text-muted-foreground">Nível: {guild.level}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          {/* Guild Skills Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" /> Habilidades da Guilda
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dummyGuildSkills.map(skill => {
                const Icon = skill.icon;
                return (
                  <Card key={skill.id} className="p-3 flex items-center gap-3">
                    <Icon className="h-6 w-6 text-blue-400" />
                    <div>
                      <p className="font-medium">{skill.name}</p>
                      <p className="text-sm text-muted-foreground">{skill.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
          <Separator />

          {/* Join/Leave Buttons */}
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

      <Card className="w-full max-w-4xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> Membros da Guilda ({members.length})
          </CardTitle>
          <CardDescription>
            {onlineMembers.length > 0 ? `${onlineMembers.length} online` : 'Nenhum membro online.'}
          </CardDescription>
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
                  <TableHead>Cargo</TableHead>
                  <TableHead>Nível</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member, index) => {
                  const isLeader = member.id === guild.created_by;
                  const isOnline = member.status === 'Online';
                  return (
                    <TableRow key={member.id} className={isLeader ? 'bg-yellow-100/20 dark:bg-yellow-900/20' : ''}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Link to={`/game/profile/${member.id}`} className="flex items-center gap-2 text-blue-500 hover:underline">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar_url || 'https://github.com/shadcn.png'} alt={getMemberDisplayName(member)} />
                            <AvatarFallback>{getMemberDisplayName(member).charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{getMemberDisplayName(member)}</span>
                          {isLeader && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Crown className="h-4 w-4 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>Líder da Guilda</TooltipContent>
                            </Tooltip>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={isLeader ? 'bg-yellow-500 text-white' : ''}>
                          {member.guild_role || 'Membro'}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.level || 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Circle className={`h-2 w-2 ${isOnline ? 'text-green-500' : 'text-gray-400'}`} fill="currentColor" />
                          <span>{isOnline ? 'Online' : 'Offline'}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Dialog for editing guild */}
      <Dialog open={isEditingGuild} onOpenChange={setIsEditingGuild}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Guilda</DialogTitle>
            <DialogDescription>
              Atualize os detalhes da sua guilda.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editGuildName" className="text-right">
                Nome
              </Label>
              <Input
                id="editGuildName"
                value={editGuildName}
                onChange={(e) => setEditGuildName(e.target.value)}
                className="col-span-3"
                disabled={isSubmittingEdit}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editGuildDescription" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="editGuildDescription"
                value={editGuildDescription}
                onChange={(e) => setEditGuildDescription(e.target.value)}
                className="col-span-3"
                placeholder="Uma breve descrição da sua guilda..."
                disabled={isSubmittingEdit}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Avatar</Label>
              <div className="col-span-3 flex flex-col gap-2">
                <Avatar className="h-16 w-16 self-center">
                  <AvatarImage src={editGuildAvatarUrl || 'https://github.com/shadcn.png'} alt="Guild Avatar" />
                  <AvatarFallback>
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => setIsAvatarGalleryOpen(true)} disabled={isSubmittingEdit}>
                  Selecionar da Galeria
                </Button>
                <Label htmlFor="avatarUpload" className="sr-only">Upload de Avatar</Label>
                <Input
                  id="avatarUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="col-span-3"
                  disabled={isSubmittingEdit}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsEditingGuild(false)} disabled={isSubmittingEdit}>
                  Cancelar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Descartar alterações</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleUpdateGuild} disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Confirmar e salvar as alterações da guilda</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AvatarGallery
        isOpen={isAvatarGalleryOpen}
        onClose={() => setIsAvatarGalleryOpen(false)}
        onSelectAvatar={(url) => {
          setEditGuildAvatarUrl(url);
          setIsAvatarGalleryOpen(false);
        }}
        selectedAvatarUrl={editGuildAvatarUrl}
      />
    </div>
  );
};

export default GuildProfile;