"use client"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Moon, Sun, User, Bell } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Sidebar } from "./Sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import UserStatsDisplay from './UserStatsDisplay'; // Importar o novo componente

export const Navbar: React.FC = () => {
  const { setTheme } = useTheme()
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair: " + error.message);
      console.error("Logout error:", error);
    } else {
      toast.success("Você saiu com sucesso!");
      navigate('/login');
    }
  };

  const handleShowNotification = () => {
    toast.info("Você tem uma nova notificação!", {
      description: "Sua missão diária foi atualizada.",
      action: {
        label: "Ver",
        onClick: () => console.log("Ver notificação"),
      },
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center py-4">
        {/* Seção Esquerda: Menu Mobile (se for mobile) e Título do App */}
        <div className="flex items-center">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="mr-2">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Abrir menu lateral</TooltipContent>
                </Tooltip>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <Sidebar />
              </SheetContent>
            </Sheet>
          )}
          <Link to="/game" className="text-2xl font-bold tracking-tight">
            Jogo de RPG
          </Link>
        </div>

        {/* Seção Central: Exibição de Estatísticas do Usuário (apenas em desktop) */}
        <div className="flex-1 flex justify-center">
          {!isMobile && <UserStatsDisplay />}
        </div>

        {/* Seção Direita: Notificação, Perfil, Tema */}
        <div className="flex items-center space-x-4">
          {/* Ícone de Notificação */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleShowNotification}>
                <Bell className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Notificações</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver Notificações</TooltipContent>
          </Tooltip>

          {/* Dropdown de Perfil (agora primeiro) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Menu do usuário</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Menu do Usuário</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/game/profile">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown de Alternância de Tema (agora segundo) */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Alternar tema</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Alternar tema</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Claro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Escuro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                Sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};