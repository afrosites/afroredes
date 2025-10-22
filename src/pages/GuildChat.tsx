"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquareText, ArrowLeft, Users, Circle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GuildMessage {
  id: string;
  guild_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  profiles: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    status: string | null;
  } | null;
}

interface GuildData {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface OnlinePlayer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  status: string | null;
}

const GuildChat: React.FC = () => {
  const { id: guildId } = useParams<{ id: string }>();
  const { user, isLoading: isSessionLoading } = useSession();
  const [guild, setGuild] = useState<GuildData | null>(null);
  const [messages, setMessages] = useState<GuildMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [onlineMembers, setOnlineMembers] = useState<OnlinePlayer[]>([]);
  const [loadingOnlineMembers, setLoadingOnlineMembers] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!guildId) return;

    fetchGuildDetails(guildId);
    fetchGuildMessages(guildId);
    fetchOnlineGuildMembers(guildId);

    const channel = supabase
      .channel(`guild_chat_${guildId}`)
      .on<GuildMessage>(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'guild_messages',
          filter: `guild_id=eq.${guildId}`,
        },
        (payload) => {
          // Fetch the profile data for the new message sender
          supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url, status')
            .eq('id', payload.new.sender_id)
            .single()
            .then(({ data: profileData, error: profileError }) => {
              if (profileError) {
                console.error("Error fetching profile for new message:", profileError);
                setMessages((prev) => [...prev, { ...payload.new, profiles: null }]);
              } else {
                setMessages((prev) => [...prev, { ...payload.new, profiles: profileData }]);
              }
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [guildId]);

  const fetchGuildDetails = async (id: string) => {
    const { data, error } = await supabase
      .from('guilds')
      .select('id, name, avatar_url')
      .eq('id', id)
      .single();

    if (error) {
      toast.error("Erro ao carregar detalhes da guilda: " + error.message);
      console.error("Error fetching guild details:", error);
    } else if (data) {
      setGuild(data);
    }
  };

  const fetchGuildMessages = async (id: string) => {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('guild_messages')
      .select(`
        *,
        profiles (
          id,
          first_name,
          last_name,
          avatar_url,
          status
        )
      `)
      .eq('guild_id', id)
      .order('created_at', { ascending: true })
      .limit(50); // Limit to last 50 messages

    if (error) {
      toast.error("Erro ao carregar mensagens da guilda: " + error.message);
      console.error("Error fetching guild messages:", error);
    } else if (data) {
      setMessages(data as GuildMessage[]);
    }
    setLoadingMessages(false);
  };

  const fetchOnlineGuildMembers = async (id: string) => {
    setLoadingOnlineMembers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, status')
      .eq('guild_id', id)
      .eq('status', 'Online');

    if (error) {
      console.error("Error fetching online guild members:", error);
    } else if (data) {
      setOnlineMembers(data as OnlinePlayer[]);
    }
    setLoadingOnlineMembers(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user && guildId) {
      const { error } = await supabase
        .from('guild_messages')
        .insert({
          guild_id: guildId,
          sender_id: user.id,
          content: newMessage.trim(),
        });

      if (error) {
        toast.error("Erro ao enviar mensagem: " + error.message);
        console.error("Error sending message:", error);
      } else {
        setNewMessage('');
      }
    }
  };

  const getDisplayName = (profile: { first_name: string | null; last_name: string | null } | null) => {
    return `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Aventureiro';
  };

  if (isSessionLoading || loadingMessages || loadingOnlineMembers) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <Skeleton className="h-10 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full max-w-5xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Você precisa estar logado para acessar o chat da guilda.</p>
        <Link to="/login">
          <Button variant="link" className="mt-4">Fazer Login</Button>
        </Link>
      </div>
    );
  }

  if (!guild) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4">
        <p className="text-lg text-red-600 dark:text-red-400">Guilda não encontrada ou você não tem permissão para acessá-la.</p>
        <Link to="/game/guilds">
          <Button variant="link" className="mt-4">Voltar para Guildas</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="w-full max-w-5xl mb-6 flex justify-between items-center">
        <Link to={`/game/guilds/${guildId}`}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Voltar para o perfil da Guilda</TooltipContent>
          </Tooltip>
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Chat da Guilda: {guild.name}</h2>
        <div></div> {/* Placeholder for alignment */}
      </div>

      <Card className="w-full max-w-5xl h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6" /> Conversa da Guilda
          </CardTitle>
          <CardDescription>Conecte-se com seus companheiros de guilda.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col md:flex-row p-0">
          {/* Online Members Sidebar */}
          <div className="w-full md:w-1/4 border-r dark:border-gray-700 p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" /> Membros Online ({onlineMembers.length})
            </h3>
            <ScrollArea className="flex-1 pr-2">
              <div className="grid gap-2">
                {onlineMembers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhum membro online.</p>
                ) : (
                  onlineMembers.map((member) => (
                    <Link to={`/game/profile/${member.id}`} key={member.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar_url || 'https://github.com/shadcn.png'} alt={getDisplayName(member)} />
                        <AvatarFallback>{getDisplayName(member).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{getDisplayName(member)}</span>
                      <Circle className="h-2 w-2 text-green-500 ml-auto" fill="currentColor" />
                    </Link>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isCurrentUser = msg.sender_id === user?.id;
                  const senderProfile = msg.profiles;
                  const senderName = senderProfile ? getDisplayName(senderProfile) : 'Desconhecido';
                  const senderAvatar = senderProfile?.avatar_url || 'https://github.com/shadcn.png';

                  return (
                    <div key={msg.id} className={cn("flex items-start gap-3", isCurrentUser ? 'justify-end' : '')}>
                      {!isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={senderAvatar} alt={senderName} />
                          <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn("flex flex-col", isCurrentUser ? 'items-end' : 'items-start')}>
                        <div className="flex items-center gap-2">
                          {!isCurrentUser && <span className="text-sm font-semibold">{senderName}</span>}
                          <span className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isCurrentUser && <span className="text-sm font-semibold">{senderName}</span>}
                        </div>
                        <div className={cn("max-w-xs p-3 rounded-lg", isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                          {msg.content}
                        </div>
                      </div>
                      {isCurrentUser && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={senderAvatar} alt={senderName} />
                          <AvatarFallback>{senderName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <form onSubmit={handleSendMessage} className="flex p-4 gap-2">
              <Input
                placeholder={user ? "Digite sua mensagem..." : "Faça login para conversar..."}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
                disabled={!user}
              />
              <Button type="submit" disabled={!newMessage.trim() || !user}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar</span>
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuildChat;