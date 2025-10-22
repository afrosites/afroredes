"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Settings } from "lucide-react"; // Removido FileText e Gavel
import { Button } from "@/components/ui/button";

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
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(
    location.pathname === "/game/settings"
  );

  React.useEffect(() => {
    setIsOpen(
      location.pathname === "/game/settings"
    );
  }, [location.pathname]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center justify-between w-full gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
            location.pathname === "/game/settings" && "bg-muted text-primary"
          )}
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4 w-4" />
            Configurações
          </div>
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">
        <NavLink to="/game/settings" icon={Settings} label="Geral" indent={true} />
        {/* Links de Política de Privacidade e LGPD removidos */}
      </CollapsibleContent>
    </Collapsible>
  );
};