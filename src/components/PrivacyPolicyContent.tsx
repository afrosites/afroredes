"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicyContent: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mt-8">
      <CardHeader>
        <CardTitle>Política de Privacidade</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground">
        <p>
          Nossa Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais.
          Ao utilizar nosso aplicativo, você concorda com as práticas descritas nesta política.
        </p>
        <p>
          Coletamos informações que você nos fornece diretamente, como seu nome de usuário e endereço de e-mail
          durante o registro. Também coletamos dados de uso para melhorar sua experiência no jogo.
        </p>
        <p>
          Suas informações não serão compartilhadas com terceiros sem seu consentimento, exceto quando exigido por lei.
          Tomamos medidas de segurança para proteger seus dados contra acesso não autorizado.
        </p>
        <p>
          Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.
          Para mais detalhes, entre em contato com nosso suporte.
        </p>
      </CardContent>
    </Card>
  );
};

export default PrivacyPolicyContent;