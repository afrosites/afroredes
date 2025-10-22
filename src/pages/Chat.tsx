"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, MessageSquareText } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface Message {
  id: string;
  sender: string;
  avatarUrl?: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

const dummyMessages: Message[] = [
  { id: '1', sender: 'Aventureiro', avatarUrl: 'https://github.com/shadcn.png', content: 'Olá a todos! Alguém para uma missão?', timestamp: '10:00 AM', isUser: true },
  { id: '2', sender: 'Mercador Elara', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', content: 'Estou na loja, venham ver minhas ofertas!', timestamp: '10:01 AM', isUser: false },
  { id: '3', sender: 'Alquimista Kael', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', content: 'Preciso de ervas raras para uma poção. Alguém pode ajudar?', timestamp: '10:05 AM', isUser: false },
  { id: '4', sender: 'Aventureiro', avatarUrl: 'https://github.com/shadcn.png', content: 'Posso procurar as ervas, Kael! Onde posso encontrá-las?', timestamp: '10:07 AM', isUser: true },
];

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const newMsg: Message = {
        id: String(messages.length + 1),
        sender: 'Aventureiro', // Substituir pelo nome do usuário logado
        avatarUrl: 'https://github.com/shadcn.png', // Substituir pelo avatar do usuário logado
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isUser: true,
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Chat Global</h2>
      <Card className="w-full max-w-3xl h-[600px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquareText className="h-6 w-6" /> Conversa Geral
          </CardTitle>
          <CardDescription>Conecte-se com outros aventureiros do mundo.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : ''}`}>
                  {!msg.isUser && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.avatarUrl} alt={msg.sender} />
                      <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2">
                      {!msg.isUser && <span className="text-sm font-semibold">{msg.sender}</span>}
                      <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                      {msg.isUser && <span className="text-sm font-semibold">{msg.sender}</span>}
                    </div>
                    <div className={`max-w-xs p-3 rounded-lg ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
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
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Enviar</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;