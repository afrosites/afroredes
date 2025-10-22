"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LGPDContent: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mt-8">
      <CardHeader>
        <CardTitle>Lei Geral de Proteção de Dados (LGPD)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
          Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
          garantimos a você o controle sobre seus dados pessoais.
        </p>
        <p>
          Seus dados são tratados com a máxima segurança e transparência,
          e você possui direitos como titular, incluindo o direito de acesso,
          correção, anonimização, bloqueio ou eliminação de dados desnecessários,
          excessivos ou tratados em desconformidade com a LGPD.
        </p>
        <p>
          Para exercer seus direitos ou obter mais informações sobre como seus dados
          são tratados em nosso aplicativo, por favor, entre em contato conosco
          através dos canais de suporte.
        </p>
      </CardContent>
    </Card>
  );
};

export default LGPDContent;