"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User as UserIcon } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  guild_role: string | null; // Adicionado campo de cargo na guilda
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
  const [guildRoleInput, setGuildRoleInput] = useState(''); // Estado para o cargo na guilda

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
      .select('first_name, last_name, avatar_url, bio, class, level, guilds(name), status, gender, guild_role') // Incluir gênero e guild_role
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
      setGuildRoleInput(data.guild_role || 'Membro'); // Definir cargo inicial
    }
    setLoadingProfile(false);
  };

  const handleUpdateProfile = async () => {
    if (!user) return;

    setLoadingProfile(true);
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
        guild_role: guildRoleInput, // Salvar cargo na guilda
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
    setLoadingProfile(false);
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
        <CardHeader className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={displayAvatar} alt={displayName} />
            <AvatarFallback>
              <UserIcon className="h-12 w-12 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <CardTitle className="text-2xl">{displayName}</CardTitle>
          <p className="text-muted-foreground">{displayEmail}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Primeiro Nome</Label>
                <Input
                  id="firstName"
                  value={firstNameInput}
                  onChange={(e) => setFirstNameInput(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Sobrenome</Label>
                <Input
                  id="lastName"
                  value={lastNameInput}
                  onChange={(e) => setLastNameInput(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="avatarUrl">URL do Avatar</Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrlInput}
                  onChange={(e) => setAvatarUrlInput(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bio">Biografia</Label>
                <Textarea
                  id="bio"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Conte-nos um pouco sobre você..."
                />
              </div>
              <div>
                <Label htmlFor="class">Classe</Label>
                <Input
                  id="class"
                  value={classInput}
                  onChange={(e) => setClassInput(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="level">Nível</Label>
                <Input
                  id="level"
                  type="number"
                  value={levelInput}
                  onChange={(e) => setLevelInput(parseInt(e.target.value) || '')}
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={statusInput} onValueChange={setStatusInput}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Selecionar Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Ausente">Ausente</SelectItem>
                    <SelectItem value="Ocupado">Ocupado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="gender">Gênero</Label>
                <Select value={genderInput} onValueChange={setGenderInput}>
                  <SelectTrigger id="gender" className="w-full">
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
              {/* Campo de seleção de Cargo na Guilda (apenas para visualização, não editável aqui) */}
              <div>
                <Label htmlFor="guildRole">Cargo na Guilda</Label>
                <Input
                  id="guildRole"
                  value={guildRoleInput || 'Nenhum'}
                  disabled // Não editável diretamente aqui
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Descartar alterações no perfil</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleUpdateProfile} disabled={loadingProfile}>
                      {loadingProfile ? 'Salvando...' : 'Salvar'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Salvar as alterações no perfil</TooltipContent>
                </Tooltip>
              </div>
            </div>
          ) : (
            <>
              <p className="text-center text-gray-700 dark:text-gray-300">
                {profile?.bio || "Nenhuma biografia definida. Edite seu perfil para adicionar uma!"}
              </p>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nível:</p>
                  <p className="text-lg font-semibold">{profile?.level || 1}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classe:</p>
                  <p className="text-lg font-semibold">{profile?.class || 'Aventureiro'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status:</p>
                  <p className="text-lg font-semibold">{profile?.status || 'Online'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Gênero:</p>
                  <p className="text-lg font-semibold">{profile?.gender || 'Não especificado'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
                  <p className="text-lg font-semibold">{profile?.guilds?.name || 'Nenhuma'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cargo na Guilda:</p>
                  <p className="text-lg font-semibold">{profile?.guild_role || 'Nenhum'}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                  </TooltipTrigger>
                  <TooltipContent>Modificar as informações do seu perfil</TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;