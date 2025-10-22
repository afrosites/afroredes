"use client"

import React from "react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Briefcase, ScrollText, Sparkles, Shield, Award, User, Settings } from "lucide-react" // Import Settings icon

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
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
          <NavLink to="/game" icon={User} label="Status" />
          <NavLink to="/game/inventory" icon={Briefcase} label="Inventário" />
          <NavLink to="/game/skills" icon={Sparkles} label="Habilidades" />
          <NavLink to="/game/quests" icon={ScrollText} label="Missões" />
          <NavLink to="/game/guilds" icon={Shield} label="Guildas" />
          <NavLink to="/game/ranking" icon={Award} label="Ranking" />
        </nav>
      </div>
      {/* Settings link at the bottom */}
      <div className="mt-auto border-t py-2">
        <nav className="grid items-start px-4 text-sm font-medium lg:px-6">
          <NavLink to="/game/settings" icon={Settings} label="Configurações" />
        </nav>
      </div>
    </div>
  );
};