"use client";

import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Coins, Sparkles } from 'lucide-react';
import { useSession } from '@/components/SessionContextProvider';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface UserStats {
  level: number;
  current_xp: number;
  gold: number;
}

const UserStatsDisplay: React.FC = () => {
  const { user, isLoading: isSessionLoading } = useSession();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    } else if (!isSessionLoading) {
      setLoadingStats(false);
    }
  }, [user, isSessionLoading]);

  const fetchUserStats = async () => {
    setLoadingStats(true);
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('level, current_xp, gold')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching user stats:", error);
    } else if (data) {
      setUserStats(data as UserStats);
    }
    setLoadingStats(false);
  };

  if (isSessionLoading || loadingStats) {
    return (
      <div className="flex items-center space-x-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (!userStats) {
    return null; // Não mostra nada se o usuário não estiver logado ou não tiver stats
  }

  // Lógica simples para calcular XP para o próximo nível
  const xpToNextLevel = userStats.level * 100; 
  const xpPercentage = (userStats.current_xp / xpToNextLevel) * 100;

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <Sparkles className="h-4 w-4 text-yellow-500" />
        <span>Nível: {userStats.level}</span>
      </div>
      <div className="w-32">
        <Progress value={xpPercentage} className="h-2" />
        <p className="text-xs text-muted-foreground mt-1">
          XP: {userStats.current_xp}/{xpToNextLevel}
        </p>
      </div>
      <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
        <Coins className="h-4 w-4 text-yellow-600" />
        <span>{userStats.gold}</span>
      </div>
    </div>
  );
};

export default UserStatsDisplay;