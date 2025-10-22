"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { toast } from "sonner";

const SettingsForm: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [soundEffects, setSoundEffects] = React.useState(true);
  const [musicVolume, setMusicVolume] = React.useState([50]);
  const [language, setLanguage] = React.useState("pt");

  const handleSaveChanges = () => {
    // Aqui você implementaria a lógica para salvar as configurações no backend ou em um armazenamento local
    console.log("Configurações salvas:", {
      theme,
      soundEffects,
      musicVolume: musicVolume[0],
      language,
    });
    toast.success("Configurações salvas com sucesso!");
  };

  const handleResetSettings = () => {
    setTheme("system");
    setSoundEffects(true);
    setMusicVolume([50]);
    setLanguage("pt");
    toast.info("Configurações resetadas para o padrão.");
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Configurações do Jogo</CardTitle>
        <CardDescription>Ajuste as preferências do seu jogo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Setting */}
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-mode">Modo do Tema</Label>
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar Tema" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Claro</SelectItem>
              <SelectItem value="dark">Escuro</SelectItem>
              <SelectItem value="system">Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sound Effects Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="sound-effects">Efeitos Sonoros</Label>
          <Switch
            id="sound-effects"
            checked={soundEffects}
            onCheckedChange={setSoundEffects}
          />
        </div>

        {/* Music Volume Slider */}
        <div className="space-y-2">
          <Label htmlFor="music-volume">Volume da Música ({musicVolume[0]}%)</Label>
          <Slider
            id="music-volume"
            min={0}
            max={100}
            step={1}
            value={musicVolume}
            onValueChange={setMusicVolume}
            className="w-full"
          />
        </div>

        {/* Language Select */}
        <div className="flex items-center justify-between">
          <Label htmlFor="language">Idioma</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Selecionar Idioma" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pt">Português</SelectItem>
              <SelectItem value="en">Inglês</SelectItem>
              {/* Adicione mais idiomas conforme necessário */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleResetSettings}>
            Resetar
          </Button>
          <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsForm;