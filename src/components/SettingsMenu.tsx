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
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, indent = false, tooltipContent }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  const linkContent = (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
        isActive && "bg-muted text-primary",
        indent && "pl-8"
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

export const SettingsMenu: React.FC = () => {
  return (
    <NavLink to="/game/settings" icon={Settings} label="Configurações" tooltipContent="Ajuste as configurações do jogo" />
  );
};