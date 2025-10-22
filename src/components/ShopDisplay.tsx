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
import { Coins, Sword, Shield, Droplet, Gem, Store, Info } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-6 w-6" /> Loja de Itens
        </CardTitle>
        <CardDescription>Compre novos equipamentos e consumíveis para sua aventura.</CardDescription>
        {user && (
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground mt-2">
            <Coins className="h-4 w-4 text-yellow-600" />
            <span>Seu Ouro: {userGold}</span>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
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
                  <Card
                    key={item.id}
                    className="flex flex-col items-center text-center p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => setSelectedItem(item)}
                  >
                    <Icon className="h-12 w-12 mb-2 text-primary" />
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <Badge variant="outline" className="mt-1 capitalize">{translateItemType(item.item_type)}</Badge>
                    <p className="flex items-center gap-1 text-sm font-medium mt-2">
                      <Coins className="h-4 w-4 text-yellow-600" /> {item.price_gold}
                    </p>
                  </Card>
                );
              })
            )}
          </div>
        </ScrollArea>
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
            <p className="text-sm">Tipo: <Badge variant="secondary" className="capitalize">{selectedItem && translateItemType(selectedItem.item_type)}</Badge></p>
            {selectedItem?.attack_bonus > 0 && <p className="text-sm">Bônus de Ataque: +{selectedItem.attack_bonus}</p>}
            {selectedItem?.defense_bonus > 0 && <p className="text-sm">Bônus de Defesa: +{selectedItem.defense_bonus}</p>}
            {selectedItem?.health_restore > 0 && <p className="text-sm">Restaura Saúde: {selectedItem.health_restore}</p>}
            <p className="flex items-center gap-1 text-lg font-bold mt-4">
              Preço: <Coins className="h-5 w-5 text-yellow-600" /> {selectedItem?.price_gold}
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