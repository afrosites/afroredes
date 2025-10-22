"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface NPCVendorProps {
  name: string;
  description: string;
  avatarUrl?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

const NPCVendor: React.FC<NPCVendorProps> = ({ name, description, avatarUrl, onClick, isSelected }) => {
  return (
    <Card 
      className={`flex flex-col items-center text-center p-4 cursor-pointer transition-all duration-200 
                  ${isSelected ? 'border-primary ring-2 ring-primary' : 'hover:bg-muted/50'}`}
      onClick={onClick}
    >
      <Avatar className="h-16 w-16 mb-3">
        <AvatarImage src={avatarUrl || 'https://github.com/shadcn.png'} alt={name} />
        <AvatarFallback>
          <User className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <CardTitle className="text-lg font-semibold">{name}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground mt-1">{description}</CardDescription>
    </Card>
  );
};

export default NPCVendor;