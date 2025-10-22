"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon, Edit, Image as ImageIcon } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import AvatarGallery from '@/components/AvatarGallery';
import { Badge } from '@/components/ui/badge';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  class: string | null;
  level: number | null;
  guilds: { name: string } | null;
  status: string | null;
  gender: string | null;
  guild_role: string | null;
}

const Profile: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [bioInput, setBioInput] = useState('');
  const [classInput, setClassInput] = useState('');
  const [levelInput, setLevelInput] = useState<number | ''>('');
  const [statusInput, setStatusInput] = useState('Online');
  const [genderInput, setGenderInput] = useState('');
  const [guildRoleInput, setGuildRoleInput] = useState('');
  const [isAvatarGalleryOpen, setIsAvatarGalleryOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      .select('first_name, last_name, avatar_url, bio, class, level, guilds(name), status, gender, guild_role')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      toast.error("Erro ao carregar perfil: " + error.message);
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setFirstNameInput(data.first_name || '');
      setLastNameInput(data.last_name || '');
      setAvatarUrlInput(data.avatar_url || '');
      setBioInput(data.bio || '');
      setClassInput(data.class || '');
      setLevelInput(data.level || 1);
      setStatusInput(data.status || 'Online');
      setGenderInput(data.gender || '');
      setGuildRoleInput(data.guild_role || 'Membro');
    }
    setLoadingProfile(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsSubmitting(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: firstNameInput,
        last_name: lastNameInput,
        avatar_url: avatarUrlInput,
        bio: bioInput,
        class: classInput,
        level: typeof levelInput === 'number' ? levelInput : 1,
        status: statusInput,
        gender: genderInput,
        guild_role: guildRoleInput,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao atualizar perfil: " + error.message);
      console.error("Error updating profile:", error);
    } else {
      toast.success("Perfil atualizado com sucesso!");
      await fetchProfile();
      setIsEditing(false);
    }
    setIsSubmitting(false);
  };

  const handleCancelEdit = () => {
    // Reset inputs to current profile data
    setFirstNameInput(profile?.first_name || '');
    setLastNameInput(profile?.last_name || '');
    setAvatarUrlInput(profile?.avatar_url || '');
    setBioInput(profile?.bio || '');
    setClassInput(profile?.class || '');
    setLevelInput(profile?.level || 1);
    setStatusInput(profile?.status || 'Online');
    setGenderInput(profile?.gender || '');
    setGuildRoleInput(profile?.guild_role || 'Membro');
    setIsEditing(false);
  };

  if (isSessionLoading || loadingProfile) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-gray-600 dark:text-gray-400">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Você precisa estar logado para ver seu perfil.</p>
      </div>
    );
  }

  const displayName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Aventureiro';
  const displayEmail = user.email;
  const displayAvatar = profile?.avatar_url || user.user_metadata.avatar_url || 'https://github.com/shadcn.png';

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Meu Perfil</h2>
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col items-center text-center p-6">
          <Avatar className="h-28 w-28 mb-4 border-4 border-primary shadow-lg">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback className="text-5xl font-bold">
              <UserIcon className="h-16 w-16 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            {displayName}
          </CardTitle>
          <p className="text-md text-muted-foreground">{displayEmail}</p>
        </CardHeader>
        <CardContent className="space-y-6 p-6 pt-0">
          <p className="text-center text-gray-700 dark:text-gray-300 text-lg">
            {profile?.bio || "Nenhuma biografia definida. Edite seu perfil para adicionar uma!"}
          </p>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Nível:</p>
              <p className="text-xl font-semibold">{profile?.level || 1}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Classe:</p>
              <p className="text-xl font-semibold">{profile?.class || 'Aventureiro'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status:</p>
              <Badge variant="outline" className="text-lg font-semibold mt-1">
                {profile?.status || 'Online'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gênero:</p>
              <p className="text-xl font-semibold">{profile?.gender || 'Não especificado'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
              <p className="text-xl font-semibold">{profile?.guilds?.name || 'Nenhuma'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cargo na Guilda:</p>
              <Badge variant="outline" className="text-lg font-semibold mt-1">
                {profile?.guild_role || 'Nenhum'}
              </Badge>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" /> Editar Perfil
                </Button>
              </TooltipTrigger>
              <TooltipContent>Modificar as informações do seu perfil</TooltipContent>
            </Tooltip>
          </div>
        </CardContent>
      </Card>

      {/* Dialog for editing profile */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[500px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Editar Perfil</DialogTitle>
            <DialogDescription>
              Atualize suas informações de personagem e personalize seu avatar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Primeiro Nome</Label>
                <Input
                  id="firstName"
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-primary">
                  <AvatarImage src={avatarUrlInput || 'https://github.com/shadcn.png'} alt="Profile Avatar" />
                  <AvatarFallback>
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => setIsAvatarGalleryOpen(true)} disabled={isSubmitting}>
                  <ImageIcon className="mr-2 h-4 w-4" /> Selecionar Avatar
                </Button>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                placeholder="Conte-nos um pouco sobre você..."
                disabled={isSubmitting}
                rows={3}
              />
            </div>

            {/* Class and Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  value={levelInput}
                  onChange={(e) => setLevelInput(parseInt(e.target.value) || '')}
                  min="1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Status and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusInput} onValueChange={setStatusInput} disabled={isSubmitting}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecionar Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Ausente">Ausente</SelectItem>
                    <SelectItem value="Ocupado">Ocupado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gênero</Label>
                <Select value={genderInput} onValueChange={setGenderInput} disabled={isSubmitting}>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Selecionar Gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                    <SelectItem value="Não Binário">Não Binário</SelectItem>
                    <SelectItem value="Prefiro não dizer">Prefiro não dizer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Guild Role (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="guildRole">Cargo na Guilda</Label>
              <Input
                id="guildRole"
                value={profile?.guild_role || 'Nenhum'}
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-sm text-muted-foreground">O cargo na guilda é definido pela sua guilda.</p>
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateProfile} disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AvatarGallery
        isOpen={isAvatarGalleryOpen}
        onClose={() => setIsAvatarGalleryOpen(false)}
        onSelectAvatar={(url) => {
          setAvatarUrlInput(url);
          setIsAvatarGalleryOpen(false);
        }}
        selectedAvatarUrl={avatarUrlInput}
      />
    </div>
  );
};

export default Profile;