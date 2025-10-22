"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquareText, Users, Circle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionContextProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

interface OnlinePlayer {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  status: string | null;
}

const dummyMessages: Message[] = [
  { id: '1', sender: 'Mercador Elara', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', content: 'Olá a todos! Alguém para uma missão?', timestamp: '10:00 AM', isUser: false },
  { id: '2', sender: 'Alquimista Kael', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', content: 'Estou na loja, venham ver minhas ofertas!', timestamp: '10:01 AM', isUser: false },
  { id: '3', sender: 'Mestre Ferreiro', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-e69fe254fe58?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8fHx8fA%3D%3D', content: 'Preciso de ervas raras para uma poção. Alguém pode ajudar?', timestamp: '10:05 AM', isUser: false },
];

const Chat: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const [onlinePlayers, setOnlinePlayers] = useState<OnlinePlayer[]>([]);
  const [loadingOnlinePlayers, setLoadingOnlinePlayers] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isSessionLoading) {
      fetchOnlinePlayers();
    }
  }, [isSessionLoading]);

  const fetchOnlinePlayers = async () => {
    setLoadingOnlinePlayers(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, status')
      .eq('status', 'Online'); // Filtra por status 'Online'

    if (error) {
      console.error("Error fetching online players:", error);
    } else if (data) {
      setOnlinePlayers(data as OnlinePlayer[]);
    }
    setLoadingOnlinePlayers(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && user) {
      const senderName = `${user.user_metadata.first_name || ''} ${user.user_metadata.last_name || ''}`.trim() || user.email?.split('@')[0] || 'Aventureiro';
      const senderAvatar = user.user_metadata.avatar_url || 'https://github.com/shadcn.png';

      const newMsg: Message = {
        id: String(messages.length + 1),
        sender: senderName,
        avatarUrl: senderAvatar,
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  const getPlayerDisplayName = (player: OnlinePlayer) => {
    return `${player.first_name || ''} ${player.last_name || ''}`.trim() || 'Aventureiro';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Chat Global</h2>
      <Card className="w-full max-w-5xl h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6" /> Conversa Geral
          </CardTitle>
          <CardDescription>Conecte-se com outros aventureiros do mundo.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col md:flex-row p-0">
          {/* Online Players Sidebar */}
          <div className="w-full md:w-1/4 border-r dark:border-gray-700 p-4 flex flex-col">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" /> Online ({onlinePlayers.length})
            </h3>
            <ScrollArea className="flex-1 pr-2">
              <div className="grid gap-2">
                {loadingOnlinePlayers ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 p-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))
                ) : onlinePlayers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">Nenhum jogador online.</p>
                ) : (
                  onlinePlayers.map((player) => (
                    <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={player.avatar_url || 'https://github.com/shadcn.png'} alt={getPlayerDisplayName(player)} />
                        <AvatarFallback>{getPlayerDisplayName(player).charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{getPlayerDisplayName(player)}</span>
                      <Circle className="h-2 w-2 text-green-500 ml-auto" fill="currentColor" />
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("flex items-start gap-3", msg.isUser ? 'justify-end' : '')}>
                    {!msg.isUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatarUrl} alt={msg.sender} />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn("flex flex-col", msg.isUser ? 'items-end' : 'items-start')}>
                      <div className="flex items-center gap-2">
                        {!msg.isUser && <span className="text-sm font-semibold">{msg.sender}</span>}
                        <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        {msg.isUser && <span className="text-sm font-semibold">{msg.sender}</span>}
                      </div>
                      <div className={cn("max-w-xs p-3 rounded-lg", msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                        {msg.content}
                      </div>
                    </div>
                    {msg.isUser && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.avatarUrl} alt={msg.sender} />
                        <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
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

export default Chat;