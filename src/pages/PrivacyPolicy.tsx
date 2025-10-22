"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Política de Privacidade</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-6 text-muted-foreground">
              <p>
                Esta Política de Privacidade descreve como [Nome do Seu Aplicativo] coleta, usa e protege suas informações pessoais.
                Ao usar nosso aplicativo, você concorda com a coleta e uso de informações de acordo com esta política.
              </p>

              <h3 className="text-xl font-semibold text-foreground">1. Coleta de Informações</h3>
              <p>
                Coletamos vários tipos de informações para fornecer e melhorar nosso Serviço para você.
                Tipos de Dados Coletados:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Dados Pessoais:</strong> Ao usar nosso Serviço, podemos solicitar que você nos forneça certas informações de identificação pessoal que podem ser usadas para contatá-lo ou identificá-lo ("Dados Pessoais"). As informações de identificação pessoal podem incluir, mas não se limitam a: endereço de e-mail, nome e sobrenome, dados de uso.</li>
                <li><strong>Dados de Uso:</strong> Também podemos coletar informações sobre como o Serviço é acessado e usado ("Dados de Uso"). Esses Dados de Uso podem incluir informações como o endereço de Protocolo de Internet do seu computador (por exemplo, endereço IP), tipo de navegador, versão do navegador, as páginas do nosso Serviço que você visita, a hora e a data da sua visita, o tempo gasto nessas páginas, identificadores exclusivos de dispositivos e outros dados de diagnóstico.</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">2. Uso de Dados</h3>
              <p>
                [Nome do Seu Aplicativo] usa os dados coletados para diversas finalidades:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Para fornecer e manter o Serviço</li>
                <li>Para notificá-lo sobre alterações em nosso Serviço</li>
                <li>Para permitir que você participe de recursos interativos do nosso Serviço quando você optar por fazê-lo</li>
                <li>Para fornecer suporte ao cliente</li>
                <li>Para monitorar o uso do Serviço</li>
                <li>Para detectar, prevenir e resolver problemas técnicos</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">3. Divulgação de Dados</h3>
              <p>
                Podemos divulgar seus Dados Pessoais de boa fé, acreditando que tal ação é necessária para:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Cumprir uma obrigação legal</li>
                <li>Proteger e defender os direitos ou propriedade de [Nome do Seu Aplicativo]</li>
                <li>Prevenir ou investigar possíveis irregularidades relacionadas ao Serviço</li>
                <li>Proteger a segurança pessoal dos usuários do Serviço ou do público</li>
                <li>Proteger contra responsabilidade legal</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">4. Segurança dos Dados</h3>
              <p>
                A segurança dos seus dados é importante para nós, mas lembre-se que nenhum método de transmissão pela Internet,
                ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente
                aceitáveis para proteger seus Dados Pessoais, não podemos garantir sua segurança absoluta.
              </p>

              <h3 className="text-xl font-semibold text-foreground">5. Links para Outros Sites</h3>
              <p>
                Nosso Serviço pode conter links para outros sites que não são operados por nós. Se você clicar em um link de
                terceiros, você será direcionado para o site desse terceiro. Aconselhamos vivamente que você revise a Política
                de Privacidade de cada site que você visita.
              </p>

              <h3 className="text-xl font-semibold text-foreground">6. Alterações a Esta Política de Privacidade</h3>
              <p>
                Podemos atualizar nossa Política de Privacidade de tempos em tempos. Iremos notificá-lo de quaisquer alterações
                publicando a nova Política de Privacidade nesta página.
              </p>
              <p>
                Aconselhamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.
                As alterações a esta Política de Privacidade são efetivas quando são publicadas nesta página.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicy;