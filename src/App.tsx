import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Game from "./pages/Game";
import Inventory from "./pages/Inventory";
import Skills from "./pages/Skills";
import Quests from "./pages/Quests";
import Guilds from "./pages/Guilds";
import Ranking from "./pages/Ranking";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import new page
import LGPD from "./pages/LGPD"; // Import new page
import { ThemeProvider } from "@/components/theme-provider";
import GameLayout from "./layouts/GameLayout";
import { SessionContextProvider } from "./components/SessionContextProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SessionContextProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/game" element={<GameLayout><Game /></GameLayout>} />
              <Route path="/game/inventory" element={<GameLayout><Inventory /></GameLayout>} />
              <Route path="/game/skills" element={<GameLayout><Skills /></GameLayout>} />
              <Route path="/game/quests" element={<GameLayout><Quests /></GameLayout>} />
              <Route path="/game/guilds" element={<GameLayout><Guilds /></GameLayout>} />
              <Route path="/game/ranking" element={<GameLayout><Ranking /></GameLayout>} />
              <Route path="/game/profile" element={<GameLayout><Profile /></GameLayout>} />
              <Route path="/game/settings" element={<GameLayout><Settings /></GameLayout>} />
              <Route path="/game/privacy-policy" element={<GameLayout><PrivacyPolicy /></GameLayout>} /> {/* New route */}
              <Route path="/game/lgpd" element={<GameLayout><LGPD /></GameLayout>} /> {/* New route */}
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SessionContextProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;