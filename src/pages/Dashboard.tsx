"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, Users, Gamepad, Trophy, Coins, Sparkles, Sword, Shield } from 'lucide-react'; // Ícones adicionais para o dashboard
import { Progress } from '@/components/ui/progress'; // Importar Progress
import { Badge } from '@/components/ui/badge'; // Importar Badge

const Dashboard: React.FC = () => {
  // Dados fictícios para o dashboard
  const totalPlayers = "1,234,567";
  const avgPlaytime = "3h 45m";
  const questsCompleted = 52;
  const playerLevel = 15;
  const playerCurrentXp = 75; // Exemplo
  const playerXpToNextLevel = playerLevel * 10; // Lógica simples para XP
  const playerGold = "12,500";
  const enemiesDefeated = 345;
  const playerClass = "Guerreiro"; // Exemplo

  const xpPercentage = (playerCurrentXp / playerXpToNextLevel) * 100;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">Dashboard do Aventureiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Card de Boas-Vindas */}
        <Card className="lg:col-span-3 bg-gradient-to-r from-primary to-blue-600 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-3xl font-extrabold">Bem-vindo de volta, Aventureiro!</CardTitle>
            <CardDescription className="text-blue-100">Aqui está um resumo rápido do seu progresso e do mundo.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-blue-50">
              Continue sua jornada, explore novas terras e conquiste desafios!
            </p>
          </CardContent>
        </Card>

        {/* Card de Estatísticas Rápidas - Total de Jogadores */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jogadores</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">+20.1% desde o mês passado</p>
          </CardContent>
        </Card>

        {/* Card de Estatísticas Rápidas - Tempo de Jogo Médio */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Jogo Médio</CardTitle>
            <Gamepad className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgPlaytime}</div>
            <p className="text-xs text-muted-foreground">Por sessão</p>
          </CardContent>
        </Card>

        {/* Card de Estatísticas Rápidas - Missões Completadas */}
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missões Completadas</CardTitle>
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{questsCompleted}</div>
            <p className="text-xs text-muted-foreground">Nesta semana</p>
          </CardContent>
        </Card>

        {/* Card de Progresso do Personagem */}
        <Card className="md:col-span-2 lg:col-span-3 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-yellow-500" /> Seu Progresso
            </CardTitle>
            <CardDescription>Visão geral das suas conquistas e status atual.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-medium text-muted-foreground">Nível Atual:</p>
                <p className="text-4xl font-extrabold text-primary">{playerLevel}</p>
                <Badge variant="outline" className="mt-2 text-lg">{playerClass}</Badge>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-medium text-muted-foreground">Experiência:</p>
                <div className="w-full max-w-[150px] mt-2">
                  <Progress value={xpPercentage} className="h-3" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {playerCurrentXp}/{playerXpToNextLevel} XP
                  </p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Faltam {playerXpToNextLevel - playerCurrentXp} XP para o Nível {playerLevel + 1}
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-medium text-muted-foreground">Ouro Total:</p>
                <div className="flex items-center gap-2 text-4xl font-extrabold text-yellow-600 mt-2">
                  <Coins className="h-8 w-8" />
                  <span>{playerGold}</span>
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                <p className="text-sm font-medium text-muted-foreground">Inimigos Derrotados:</p>
                <div className="flex items-center gap-2 text-4xl font-extrabold text-red-600 mt-2">
                  <Sword className="h-8 w-8" />
                  <span>{enemiesDefeated}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;