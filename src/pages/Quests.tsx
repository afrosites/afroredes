"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { PlusCircle, BookOpen, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Importar componentes de Tooltip

interface Quest {
  id: string;
  title: string;
  description: string;
  reward_xp: number;
  reward_gold: number;
  required_level: number;
  created_at: string;
}

const Quests: React.FC = () => {
  const { user } = useSession();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loadingQuests, setLoadingQuests] = useState(true);
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isAcceptingQuest, setIsAcceptingQuest] = useState(false);
  const [isCreatingQuest, setIsCreatingQuest] = useState(false);
  const [newQuestTitle, setNewQuestTitle] = useState('');
  const [newQuestDescription, setNewQuestDescription] = useState('');
  const [newQuestRewardXp, setNewQuestRewardXp] = useState(0);
  const [newQuestRewardGold, setNewQuestRewardGold] = useState(0);
  const [newQuestRequiredLevel, setNewQuestRequiredLevel] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulated user quest status (for demonstration without a user_quests table)
  const [userAcceptedQuests, setUserAcceptedQuests] = useState<Set<string>>(new Set());
  const [userCompletedQuests, setUserCompletedQuests] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    setLoadingQuests(true);
    const { data, error } = await supabase
      .from('quests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao carregar missões: " + error.message);
      console.error("Error fetching quests:", error);
    } else if (data) {
      setQuests(data as Quest[]);
    }
    setLoadingQuests(false);
  };

  const handleAcceptQuest = (quest: Quest) => {
    if (!user) {
      toast.error("Você precisa estar logado para aceitar missões.");
      return;
    }
    setUserAcceptedQuests(prev => new Set(prev).add(quest.id));
    toast.success(`Missão "${quest.title}" aceita!`);
    setSelectedQuest(null); // Close dialog after accepting
  };

  const handleCompleteQuest = (quest: Quest) => {
    if (!user) {
      toast.error("Você precisa estar logado para completar missões.");
      return;
    }
    setUserCompletedQuests(prev => new Set(prev).add(quest.id));
    setUserAcceptedQuests(prev => {
      const newSet = new Set(prev);
      newSet.delete(quest.id);
      return newSet;
    });
    toast.success(`Missão "${quest.title}" completada! Recompensas recebidas.`);
  };

  const handleCreateQuest = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para criar missões.");
      return;
    }
    if (!newQuestTitle.trim()) {
      toast.error("O título da missão não pode ser vazio.");
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('quests')
      .insert({
        title: newQuestTitle.trim(),
        description: newQuestDescription.trim(),
        reward_xp: newQuestRewardXp,
        reward_gold: newQuestRewardGold,
        required_level: newQuestRequiredLevel,
      })
      .select()
      .single();

    if (error) {
      toast.error("Erro ao criar missão: " + error.message);
      console.error("Error creating quest:", error);
    } else if (data) {
      toast.success(`Missão "${data.title}" criada com sucesso!`);
      fetchQuests(); // Refresh the list
      setIsCreatingQuest(false);
      setNewQuestTitle('');
      setNewQuestDescription('');
      setNewQuestRewardXp(0);
      setNewQuestRewardGold(0);
      setNewQuestRequiredLevel(1);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Missões</h2>
      <Card className="w-full max-w-4xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Missões Disponíveis</CardTitle>
            <CardDescription>Embarque em novas aventuras e ganhe recompensas!</CardDescription>
          </div>
          {user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => setIsCreatingQuest(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Criar Nova Missão
                </Button>
              </TooltipTrigger>
              <TooltipContent>Crie uma nova missão para outros aventureiros</TooltipContent>
            </Tooltip>
          )}
        </CardHeader>
        <CardContent>
          {loadingQuests ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : quests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Nenhuma missão encontrada. Crie uma para começar!</p>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="grid gap-4">
                {quests.map((quest) => {
                  const isAccepted = userAcceptedQuests.has(quest.id);
                  const isCompleted = userCompletedQuests.has(quest.id);
                  return (
                    <Card key={quest.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          {quest.title}
                          {isAccepted && !isCompleted && <Badge variant="outline" className="bg-yellow-500 text-white">Aceita</Badge>}
                          {isCompleted && <Badge variant="outline" className="bg-green-500 text-white">Completa</Badge>}
                        </h3>
                        <p className="text-sm text-muted-foreground">{quest.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span>XP: {quest.reward_xp}</span>
                          <span>Ouro: {quest.reward_gold}</span>
                          <span>Nível Req.: {quest.required_level}</span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 flex gap-2">
                        {!isAccepted && !isCompleted && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="outline" onClick={() => { setSelectedQuest(quest); setIsAcceptingQuest(true); }} disabled={!user}>
                                Aceitar Missão
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Aceite esta missão para iniciar sua jornada</TooltipContent>
                          </Tooltip>
                        )}
                        {isAccepted && !isCompleted && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button onClick={() => handleCompleteQuest(quest)} disabled={!user}>
                                Completar Missão
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Marque esta missão como completa e receba suas recompensas</TooltipContent>
                          </Tooltip>
                        )}
                        {isCompleted && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="secondary" disabled>
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Concluída
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Esta missão já foi concluída</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Dialog for accepting a quest */}
      <Dialog open={isAcceptingQuest} onOpenChange={setIsAcceptingQuest}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedQuest?.title}</DialogTitle>
            <DialogDescription>
              {selectedQuest?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <p>Recompensa XP: {selectedQuest?.reward_xp}</p>
            <p>Recompensa Ouro: {selectedQuest?.reward_gold}</p>
            <p>Nível Requerido: {selectedQuest?.required_level}</p>
          </div>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsAcceptingQuest(false)}>Cancelar</Button>
              </TooltipTrigger>
              <TooltipContent>Não aceitar esta missão</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => selectedQuest && handleAcceptQuest(selectedQuest)}>Aceitar</Button>
              </TooltipTrigger>
              <TooltipContent>Aceitar esta missão</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for creating a new quest */}
      <Dialog open={isCreatingQuest} onOpenChange={setIsCreatingQuest}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Criar Nova Missão</DialogTitle>
            <DialogDescription>
              Defina os detalhes da nova missão para os aventureiros.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questTitle" className="text-right">
                Título
              </Label>
              <Input
                id="questTitle"
                value={newQuestTitle}
                onChange={(e) => setNewQuestTitle(e.target.value)}
                className="col-span-3"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="questDescription" className="text-right">
                Descrição
              </Label>
              <Textarea
                id="questDescription"
                value={newQuestDescription}
                onChange={(e) => setNewQuestDescription(e.target.value)}
                className="col-span-3"
                placeholder="Uma breve descrição da missão..."
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardXp" className="text-right">
                Recompensa XP
              </Label>
              <Input
                id="rewardXp"
                type="number"
                value={newQuestRewardXp}
                onChange={(e) => setNewQuestRewardXp(parseInt(e.target.value) || 0)}
                className="col-span-3"
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rewardGold" className="text-right">
                Recompensa Ouro
              </Label>
              <Input
                id="rewardGold"
                type="number"
                value={newQuestRewardGold}
                onChange={(e) => setNewQuestRewardGold(parseInt(e.target.value) || 0)}
                className="col-span-3"
                min="0"
                disabled={isSubmitting}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requiredLevel" className="text-right">
                Nível Requerido
              </Label>
              <Input
                id="requiredLevel"
                type="number"
                value={newQuestRequiredLevel}
                onChange={(e) => setNewQuestRequiredLevel(parseInt(e.target.value) || 1)}
                className="col-span-3"
                min="1"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setIsCreatingQuest(false)} disabled={isSubmitting}>
                  Cancelar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Descartar criação da missão</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleCreateQuest} disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Missão'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Confirmar criação da missão</TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Quests;