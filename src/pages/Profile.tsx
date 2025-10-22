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
import { Textarea } from '@/components/ui/textarea'; // Import Textarea for bio
import { toast } from 'sonner';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  bio: string | null; // Add bio field
}

const Profile: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [firstNameInput, setFirstNameInput] = useState('');
  const [lastNameInput, setLastNameInput] = useState('');
  const [avatarUrlInput, setAvatarUrlInput] = useState('');
  const [bioInput, setBioInput] = useState(''); // State for bio input

  // Dummy data for game-specific stats not stored in Supabase profiles table
  const gameStats = {
    level: 15,
    class: "Guerreiro Mago",
    guild: "Ordem dos Dragões",
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else if (!isSessionLoading) {
      setLoadingProfile(false); // No user, no profile to load
    }
  }, [user, isSessionLoading]);

  const fetchProfile = async () => {
    setLoadingProfile(true);
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name, avatar_url, bio') // Select bio
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
      toast.error("Erro ao carregar perfil: " + error.message);
      console.error("Error fetching profile:", error);
    } else if (data) {
      setProfile(data);
      setFirstNameInput(data.first_name || '');
      setLastNameInput(data.last_name || '');
      setAvatarUrlInput(data.avatar_url || '');
      setBioInput(data.bio || ''); // Set bio input
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
        bio: bioInput, // Update bio
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      toast.error("Erro ao atualizar perfil: " + error.message);
      console.error("Error updating profile:", error);
    } else {
      toast.success("Perfil atualizado com sucesso!");
      await fetchProfile(); // Re-fetch to update state
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
  const displayAvatar = profile?.avatar_url || user.user_metadata.avatar_url || 'https://github.com/shadcn.png'; // Fallback to shadcn default

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
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleUpdateProfile} disabled={loadingProfile}>
                  {loadingProfile ? 'Salvando...' : 'Salvar'}
                </Button>
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
                  <p className="text-lg font-semibold">{gameStats.level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classe:</p>
                  <p className="text-lg font-semibold">{gameStats.class}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Guilda:</p>
                  <p className="text-lg font-semibold">{gameStats.guild}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button onClick={() => setIsEditing(true)}>Editar Perfil</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;