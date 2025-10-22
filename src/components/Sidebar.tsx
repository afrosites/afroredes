"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Briefcase, ScrollText, Sparkles, Shield, Award, User, LayoutDashboard, Map, Store } from "lucide-react" // Importar Store icon
import { SettingsMenu } from "./SettingsMenu"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  tooltipContent?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, tooltipContent }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  if (tooltipContent) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent>{tooltipContent}</TooltipContent>
      </Tooltip>
    );
  }
  return linkContent;
};

export const Sidebar: React.FC = () => {
  return (
    <div className="flex h-full max-h-screen flex-col gap-2 border-r bg-sidebar">
      <div className="flex h-16 items-center border-b px-4 lg:px-6">
        <Link to="/game" className="flex items-center gap-2 font-semibold">
          <span className="text-lg text-sidebar-foreground">RPG Menu</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          <NavLink to="/game/dashboard" icon={LayoutDashboard} label="Dashboard" tooltipContent="Visão geral do seu progresso" />
          <NavLink to="/game" icon={User} label="Status" tooltipContent="Veja as estatísticas do seu personagem" />
          <NavLink to="/game/map" icon={Map} label="Mapa do Mundo" tooltipContent="Explore o mapa do mundo" />
          <NavLink to="/game/inventory" icon={Briefcase} label="Inventário" tooltipContent="Gerencie seus itens" />
          <NavLink to="/game/skills" icon={Sparkles} label="Habilidades" tooltipContent="Gerencie suas habilidades e magias" />
          <NavLink to="/game/quests" icon={ScrollText} label="Missões" tooltipContent="Aceite e complete missões" />
          <NavLink to="/game/guilds" icon={Shield} label="Guildas" tooltipContent="Encontre ou crie uma guilda" />
          <NavLink to="/game/ranking" icon={Award} label="Ranking" tooltipContent="Veja os melhores jogadores e guildas" />
          <NavLink to="/game/shop" icon={Store} label="Loja" tooltipContent="Compre itens e equipamentos" /> {/* Novo link para a Loja */}
        </nav>
      </div>
      <div className="mt-auto border-t py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          <SettingsMenu />
        </nav>
      </div>
    </div>
  );
};