"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react"; // Removido ChevronDown

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  indent?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label, indent = false }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
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
};

export const SettingsMenu: React.FC = () => {
  // O componente SettingsMenu agora se comporta como um NavLink direto para a página de configurações.
  return (
    <NavLink to="/game/settings" icon={Settings} label="Configurações" />
  );
};