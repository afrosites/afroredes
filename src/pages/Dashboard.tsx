"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, LineChart, Users, Gamepad } from 'lucide-react'; // Ícones para o dashboard

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Dashboard do Aventureiro</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {/* Card de Boas-Vindas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Bem-vindo de volta, Aventureiro!</CardTitle>
            <CardDescription>Aqui está um resumo rápido do seu progresso e do mundo.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Continue sua jornada, explore novas terras e conquiste desafios!
            </p>
          </CardContent>
        </Card>

        {/* Card de Estatísticas Rápidas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Jogadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234,567</div>
            <p className="text-xs text-muted-foreground">+20.1% desde o mês passado</p>
          </CardContent>
        </Card>

        {/* Card de Tempo de Jogo */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Jogo Médio</CardTitle>
            <Gamepad className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3h 45m</div>
            <p className="text-xs text-muted-foreground">Por sessão</p>
          </CardContent>
        </Card>

        {/* Card de Atividades Recentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missões Completadas</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">52</div>
            <p className="text-xs text-muted-foreground">Nesta semana</p>
          </CardContent>
        </Card>

        {/* Card de Progresso do Personagem (Exemplo) */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Seu Progresso</CardTitle>
            <CardDescription>Visão geral das suas conquistas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nível Atual:</p>
                <p className="text-xl font-semibold">15</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Próximo Nível:</p>
                <p className="text-xl font-semibold">80%</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Ouro Total:</p>
                <p className="text-xl font-semibold">12,500</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inimigos Derrotados:</p>
                <p className="text-xl font-semibold">345</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;