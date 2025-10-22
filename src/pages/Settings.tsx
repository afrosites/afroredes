import React from 'react';
import SettingsForm from '@/components/SettingsForm';
import PrivacyPolicyContent from '@/components/PrivacyPolicyContent'; // Import the new PrivacyPolicyContent component
import LGPDContent from '@/components/LGPDContent'; // Import the new LGPDContent component

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <SettingsForm /> {/* Render the SettingsForm component */}
      <PrivacyPolicyContent /> {/* Render the PrivacyPolicyContent component */}
      <LGPDContent /> {/* Render the LGPDContent component */}
    </div>
  );
};

export default Settings;