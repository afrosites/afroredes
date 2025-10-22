import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-700 text-white p-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-down">
          Embarque em uma Aventura Épica!
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-10 animate-fade-in-up">
          Descubra um mundo de magia, mistério e desafios. Crie seu herói, forje seu destino e torne-se uma lenda.
        </p>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/game">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-all duration-300 ease-in-out group">
                Iniciar Sua Jornada <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </TooltipTrigger>
          <TooltipContent>Comece sua aventura no mundo RPG!</TooltipContent>
        </Tooltip>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;