import React from 'react';
import SettingsForm from '@/components/SettingsForm';
// Removido import PrivacyPolicyContent from '@/components/PrivacyPolicyContent';
// Removido import LGPDContent from '@/components/LGPDContent';

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <SettingsForm /> {/* Render the SettingsForm component */}
      {/* Componentes de Política de Privacidade e LGPD removidos */}
    </div>
  );
};

export default Settings;