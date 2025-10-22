import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import Inventory from "./pages/Inventory"; // Import new pages
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import Guilds from "./pages/Guilds";
import Ranking from "./pages/Ranking";
import { ThemeProvider } from "@/components/theme-provider";
import GameLayout from "./layouts/GameLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/game" element={<GameLayout><Game /></GameLayout>} />
            <Route path="/game/inventory" element={<GameLayout><Inventory /></GameLayout>} /> {/* New route */}
            <Route path="/game/skills" element={<GameLayout><Skills /></GameLayout>} />       {/* New route */}
            <Route path="/game/quests" element={<GameLayout><Quests /></GameLayout>} />       {/* New route */}
            <Route path="/game/guilds" element={<GameLayout><Guilds /></GameLayout>} />       {/* New route */}
            <Route path="/game/ranking" element={<GameLayout><Ranking /></GameLayout>} />     {/* New route */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;