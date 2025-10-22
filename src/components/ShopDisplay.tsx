"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useSession } from '@/components/SessionContextProvider';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Coins, Sword, Shield, Droplet, Gem, Store, Info, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import NPCVendor from './NPCVendor'; // Importar o novo componente NPCVendor

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price_gold: number;
  item_type: 'weapon' | 'armor' | 'consumable' | 'misc';
  attack_bonus: number;
  defense_bonus: number;
  health_restore: number;
  icon_name: keyof typeof LucideIcons; // Type for Lucide icon names
}

interface NPC {
  id: string;
  name: string;
  description: string;
  avatarUrl?: string;
}

const dummyNPCs: NPC[] = [
  { id: 'npc1', name: 'Mercador Elara', description: 'Especialista em armas e armaduras.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'npc2', name: 'Alquimista Kael', description: 'Vende poções e ingredientes raros.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'npc3', name: 'Mestre Ferreiro', description: 'Forja equipamentos lendários.', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-e69fe254fe58?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const getItemIcon = (iconName?: keyof typeof LucideIcons, itemType?: ShopItem['item_type']) => {
  if (iconName && LucideIcons[iconName]) {
    return LucideIcons[iconName];
  }
  switch (itemType) {
    case 'weapon':
      return Sword;
    case 'armor':
      return Shield;
    case 'consumable':
      return Droplet;
    case 'misc':
      return Gem;
    default:
      return Info;
  }
};

const translateItemType = (type: ShopItem['item_type']) => {
  switch (type) {
    case 'weapon':
      return 'Arma';
    case 'armor':
      return 'Armadura';
    case 'consumable':
      return 'Consumível';
    case 'misc':
      return 'Diversos';
    default:
      return 'Item';
  }
};

const ShopDisplay: React.FC = () => {
  const { user } = useSession();
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [userGold, setUserGold] = useState(0);
  const [selectedNPC, setSelectedNPC] = useState<NPC | null>(dummyNPCs[0]); // Seleciona o primeiro NPC por padrão

  useEffect(() => {
    fetchShopItems();
    if (user) {
      fetchUserGold();
    }
  }, [user]);

  const fetchShopItems = async () => {
    setLoadingItems(true);
    const { data, error } = await supabase
      .from('shop_items')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      toast.error("Erro ao carregar itens da loja: " + error.message);
      console.error("Error fetching shop items:", error);
    } else if (data) {
      setShopItems(data as ShopItem[]);
    }
    setLoadingItems(false);
  };

  const fetchUserGold = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('gold')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user gold:", error);
    } else if (data) {
      setUserGold(data.gold);
    }
  };

  const handleBuyItem = async (item: ShopItem) => {
    if (!user) {
      toast.error("Você precisa estar logado para comprar itens.");
      return;
    }
    if (userGold < item.price_gold) {
      toast.error("Você não tem ouro suficiente para comprar este item.");
      return;
    }

    setIsBuying(true);
    // Simulate transaction: decrement gold and (ideally) add item to inventory
    // For now, we'll just decrement gold and show a success message.
    // A real implementation would involve a 'user_inventory' table.
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ gold: userGold - item.price_gold })
      .eq('id', user.id);

    if (updateError) {
      toast.error("Erro ao comprar item: " + updateError.message);
      console.error("Error buying item:", updateError);
    } else {
      toast.success(`Você comprou "${item.name}" por ${item.price_gold} ouro!`);
      setUserGold(prev => prev - item.price_gold); // Update local state
      setSelectedItem(null); // Close dialog
    }
    setIsBuying(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col"> {/* Aumentado a altura para acomodar NPCs */}
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-6 w-6" /> Loja de Itens
        </CardTitle>
        <CardDescription>Compre novos equipamentos e consumíveis para sua aventura.</CardDescription>
        {user && (
          <div className="flex items-center gap-1 text-lg font-bold text-yellow-600 mt-2"> {/* Aumentado o tamanho do texto do ouro */}
            <Coins className="h-5 w-5" />
            <span>Seu Ouro: {userGold}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* NPC Vendors Section */}
        <div className="border-b dark:border-gray-700 p-4">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <User className="h-5 w-5" /> Vendedores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dummyNPCs.map(npc => (
              <NPCVendor
                key={npc.id}
                name={npc.name}
                description={npc.description}
                avatarUrl={npc.avatarUrl}
                onClick={() => setSelectedNPC(npc)}
                isSelected={selectedNPC?.id === npc.id}
              />
            ))}
          </div>
        </div>

        {/* Shop Items Section */}
        <div className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-3">Itens à Venda ({selectedNPC?.name || 'Geral'})</h3>
          <ScrollArea className="h-[calc(100%-2.5rem)] pr-4"> {/* Ajustado a altura da ScrollArea */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loadingItems ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-40 w-full" />
                ))
              ) : shopItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8 col-span-full">Nenhum item disponível na loja.</p>
              ) : (
                shopItems.map((item) => {
                  const Icon = getItemIcon(item.icon_name, item.item_type);
                  return (
                    <Tooltip key={item.id}>
                      <TooltipTrigger asChild>
                        <Card
                          className="flex flex-col items-center text-center p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Icon className="h-12 w-12 mb-2 text-primary" />
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <Badge variant="outline" className="mt-1 capitalize">{translateItemType(item.item_type)}</Badge>
                          <p className="flex items-center gap-1 text-lg font-bold mt-2 text-yellow-600"> {/* Aumentado o tamanho do texto do preço */}
                            <Coins className="h-5 w-5" /> {item.price_gold}
                          </p>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {item.attack_bonus > 0 && <p className="text-xs">Ataque: +{item.attack_bonus}</p>}
                        {item.defense_bonus > 0 && <p className="text-xs">Defesa: +{item.defense_bonus}</p>}
                        {item.health_restore > 0 && <p className="text-xs">Restaura Saúde: {item.health_restore}</p>}
                        <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                          <Coins className="h-3 w-3" /> Preço: {item.price_gold}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Dialog for item details and purchase */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedItem && React.createElement(getItemIcon(selectedItem.icon_name, selectedItem.item_type), { className: "h-6 w-6" })}
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedItem?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <p className="text-base">Tipo: <Badge variant="secondary" className="capitalize text-base">{selectedItem && translateItemType(selectedItem.item_type)}</Badge></p>
            {selectedItem?.attack_bonus > 0 && <p className="text-base">Bônus de Ataque: <span className="font-semibold text-primary">+{selectedItem.attack_bonus}</span></p>}
            {selectedItem?.defense_bonus > 0 && <p className="text-base">Bônus de Defesa: <span className="font-semibold text-primary">+{selectedItem.defense_bonus}</span></p>}
            {selectedItem?.health_restore > 0 && <p className="text-base">Restaura Saúde: <span className="font-semibold text-green-500">{selectedItem.health_restore}</span></p>}
            <p className="flex items-center gap-1 text-xl font-bold mt-4 text-yellow-600">
              Preço: <Coins className="h-6 w-6" /> {selectedItem?.price_gold}
            </p>
          </div>
          <DialogFooter>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={() => setSelectedItem(null)} disabled={isBuying}>
                  Fechar
                </Button>
              </TooltipTrigger>
              <TooltipContent>Fechar detalhes do item</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => selectedItem && handleBuyItem(selectedItem)} disabled={isBuying || !user || (selectedItem && userGold < selectedItem.price_gold)}>
                  {isBuying ? 'Comprando...' : 'Comprar'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {!user ? "Faça login para comprar" : (selectedItem && userGold < selectedItem.price_gold ? "Ouro insuficiente" : "Comprar este item")}
              </TooltipContent>
            </Tooltip>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ShopDisplay;