"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sword, Shield, Gem, ScrollText, Droplet, Backpack } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InventoryItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  type: 'weapon' | 'armor' | 'consumable' | 'quest' | 'misc';
  icon?: React.ElementType;
}

const getItemIcon = (type: InventoryItem['type']) => {
  switch (type) {
    case 'weapon':
      return Sword;
    case 'armor':
      return Shield;
    case 'consumable':
      return Droplet;
    case 'quest':
      return ScrollText;
    case 'misc':
      return Gem;
    default:
      return Backpack;
  }
};

const translateItemType = (type: InventoryItem['type']) => {
  switch (type) {
    case 'weapon':
      return 'Arma';
    case 'armor':
      return 'Armadura';
    case 'consumable':
      return 'Consumível';
    case 'quest':
      return 'Missão';
    case 'misc':
      return 'Diversos';
    default:
      return 'Item';
  }
};

interface InventoryDisplayProps {
  items: InventoryItem[];
}

const InventoryDisplay: React.FC<InventoryDisplayProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);

  React.useEffect(() => {
    if (items.length > 0 && !selectedItem) {
      setSelectedItem(items[0]);
    }
  }, [items, selectedItem]);

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle>Inventário</CardTitle>
        <CardDescription>Seus itens e equipamentos.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col md:flex-row p-0">
        {/* Item List */}
        <div className="w-full md:w-1/3 border-r dark:border-gray-700 p-4 flex flex-col">
          <h3 className="text-lg font-semibold mb-3">Itens ({items.length})</h3>
          <ScrollArea className="flex-1 pr-2">
            <div className="grid gap-2">
              {items.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Seu inventário está vazio.</p>
              ) : (
                items.map((item) => {
                  const Icon = item.icon || getItemIcon(item.type);
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={cn(
                        "justify-start h-auto py-2 px-3",
                        selectedItem?.id === item.id && "bg-muted hover:bg-muted"
                      )}
                      onClick={() => setSelectedItem(item)}
                    >
                      <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
                      <div className="flex-1 text-left">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{translateItemType(item.type)}</p>
                      </div>
                      <Badge variant="secondary">{item.quantity}</Badge>
                    </Button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Item Details */}
        <div className="w-full md:w-2/3 p-4 flex flex-col">
          {selectedItem ? (
            <>
              <div className="flex items-center mb-4">
                {selectedItem.icon ? (
                  <selectedItem.icon className="h-10 w-10 mr-4 text-primary" />
                ) : (
                  React.createElement(getItemIcon(selectedItem.type), { className: "h-10 w-10 mr-4 text-primary" })
                )}
                <div>
                  <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                  <Badge variant="outline" className="mt-1 capitalize">{translateItemType(selectedItem.type)}</Badge>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-muted-foreground mb-4 flex-1">{selectedItem.description}</p>
              <div className="flex justify-end space-x-2 mt-auto">
                <Button variant="outline">Usar</Button>
                <Button variant="destructive">Descartar</Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Backpack className="h-16 w-16 mb-4" />
              <p>Selecione um item para ver os detalhes.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryDisplay;