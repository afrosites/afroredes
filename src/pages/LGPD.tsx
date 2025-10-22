"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const LGPD: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Lei Geral de Proteção de Dados (LGPD)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] p-4">
            <div className="space-y-6 text-muted-foreground">
              <p>
                A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018), ou LGPD, é a legislação brasileira
                que regula as atividades de tratamento de dados pessoais, tanto em meios digitais quanto físicos,
                por pessoa natural ou por pessoa jurídica de direito público ou privado, com o objetivo de proteger
                os direitos fundamentais de liberdade e de privacidade e o livre desenvolvimento da personalidade da pessoa natural.
              </p>

              <h3 className="text-xl font-semibold text-foreground">Princípios da LGPD</h3>
              <p>
                A LGPD é baseada em dez princípios que devem ser observados em todas as operações de tratamento de dados:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><strong>Finalidade:</strong> Realização do tratamento para propósitos legítimos, específicos, explícitos e informados ao titular.</li>
                <li><strong>Adequação:</strong> Compatibilidade do tratamento com as finalidades informadas ao titular.</li>
                <li><strong>Necessidade:</strong> Limitação do tratamento ao mínimo necessário para a realização de suas finalidades.</li>
                <li><strong>Livre Acesso:</strong> Garantia, aos titulares, de consulta facilitada e gratuita sobre a forma e duração do tratamento.</li>
                <li><strong>Qualidade dos Dados:</strong> Garantia, aos titulares, de clareza, exatidão e atualização dos dados.</li>
                <li><strong>Transparência:</strong> Garantia, aos titulares, de informações claras, precisas e facilmente acessíveis sobre o tratamento de seus dados.</li>
                <li><strong>Segurança:</strong> Utilização de medidas técnicas e administrativas aptas a proteger os dados pessoais.</li>
                <li><strong>Prevenção:</strong> Adoção de medidas para prevenir a ocorrência de danos em virtude do tratamento de dados pessoais.</li>
                <li><strong>Não Discriminação:</strong> Impossibilidade de realização do tratamento para fins discriminatórios ilícitos ou abusivos.</li>
                <li><strong>Responsabilização e Prestação de Contas:</strong> Demonstração, pelo agente, da adoção de medidas eficazes e capazes de comprovar a observância e o cumprimento das normas de proteção de dados pessoais.</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">Direitos do Titular dos Dados</h3>
              <p>
                A LGPD garante aos titulares dos dados uma série de direitos, incluindo:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Confirmação da existência de tratamento</li>
                <li>Acesso aos dados</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a LGPD</li>
                <li>Portabilidade dos dados a outro fornecedor de serviço ou produto</li>
                <li>Eliminação dos dados pessoais tratados com o consentimento do titular</li>
                <li>Informação das entidades públicas e privadas com as quais o controlador realizou uso compartilhado de dados</li>
                <li>Informação sobre a possibilidade de não fornecer consentimento e sobre as consequências da negativa</li>
                <li>Revogação do consentimento</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground">Nosso Compromisso</h3>
              <p>
                [Nome do Seu Aplicativo] está comprometido em proteger a privacidade e os dados pessoais de seus usuários,
                em conformidade com a LGPD e outras leis de proteção de dados aplicáveis. Implementamos medidas de segurança
                técnicas e organizacionais para garantir a proteção dos seus dados.
              </p>
              <p>
                Para mais informações sobre como tratamos seus dados, consulte nossa <Link to="/game/privacy-policy" className="text-primary hover:underline">Política de Privacidade</Link>.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LGPD;