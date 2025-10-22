"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Briefcase, ScrollText, Sparkles, Shield, Award, User, LayoutDashboard, Map, Store, ChevronLeft, ChevronRight, MessageSquareText, Trophy } from "lucide-react" // Importar Trophy
import { SettingsMenu } from "./SettingsMenu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  tooltipContent?: string;
  sidebarOpen: boolean; // Adicionado prop para saber o estado da sidebar
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, tooltipContent, sidebarOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
        !sidebarOpen && "justify-center" // Centraliza o ícone quando a sidebar está fechada
      )}
    >
      <Icon className="h-5 w-5" /> {/* Aumentado o tamanho do ícone aqui */}
      {sidebarOpen && label} {/* Exibe o label apenas se a sidebar estiver aberta */}
    </Link>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{tooltipContent}</TooltipContent> {/* Tooltip à direita para ícones */}
      </Tooltip>
    );
  }
  return linkContent;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const ToggleIcon = sidebarOpen ? ChevronLeft : ChevronRight;
  const toggleTooltipContent = sidebarOpen ? "Ocultar menu lateral" : "Mostrar menu lateral";

  return (
    <div className="flex h-full max-h-screen flex-col gap-2 border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-4 lg:px-6 justify-between">
        <Link to="/game" className="flex items-center gap-2 font-semibold">
          {sidebarOpen && <span className="text-lg text-sidebar-foreground">Afro Redes</span>} {/* Título visível apenas quando aberto */}
        </Link>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden lg:flex"
            >
              <ToggleIcon className="h-5 w-5" />
              <span className="sr-only">{toggleTooltipContent}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{toggleTooltipContent}</TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          <NavLink to="/game/dashboard" icon={LayoutDashboard} label="Dashboard" tooltipContent="Visão geral do seu progresso" sidebarOpen={sidebarOpen} />
          <NavLink to="/game" icon={User} label="Status" tooltipContent="Veja as estatísticas do seu personagem" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/map" icon={Map} label="Mapa do Mundo" tooltipContent="Explore o mapa do mundo" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/inventory" icon={Briefcase} label="Inventário" tooltipContent="Gerencie seus itens" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/skills" icon={Sparkles} label="Habilidades" tooltipContent="Gerencie suas habilidades e magias" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/quests" icon={ScrollText} label="Missões" tooltipContent="Aceite e complete missões" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/guilds" icon={Shield} label="Guildas" tooltipContent="Encontre ou crie uma guilda" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/ranking" icon={Award} label="Ranking" tooltipContent="Veja os melhores jogadores e guildas" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/achievements" icon={Trophy} label="Conquistas" tooltipContent="Acompanhe suas conquistas no jogo" sidebarOpen={sidebarOpen} /> {/* Novo link para Conquistas */}
          <NavLink to="/game/shop" icon={Store} label="Loja" tooltipContent="Compre itens e equipamentos" sidebarOpen={sidebarOpen} />
          <NavLink to="/game/chat" icon={MessageSquareText} label="Chat" tooltipContent="Converse com outros aventureiros" sidebarOpen={sidebarOpen} />
        </nav>
      </div>
      <div className="mt-auto border-t py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          {/* SettingsMenu também precisa da prop sidebarOpen se for ter comportamento similar */}
          <SettingsMenu sidebarOpen={sidebarOpen} />
        </nav>
      </div>
    </div>
  );
};