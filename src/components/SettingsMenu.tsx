"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"; // Importar componentes de Tooltip

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  indent?: boolean;
  tooltipContent?: string; // Adicionado para compatibilidade com Sidebar NavLink
  sidebarOpen: boolean; // Adicionado prop para saber o estado da sidebar
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, indent = false, tooltipContent, sidebarOpen }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
        indent && "pl-8",
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

interface SettingsMenuProps {
  sidebarOpen: boolean;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ sidebarOpen }) => {
  return (
    <NavLink to="/game/settings" icon={Settings} label="Configurações" tooltipContent="Ajuste as configurações do jogo" sidebarOpen={sidebarOpen} />
  );
};