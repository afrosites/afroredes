import React from 'react';
import SettingsForm from '@/components/SettingsForm'; // Import the new SettingsForm component

const Settings: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <SettingsForm /> {/* Render the SettingsForm component */}
    </div>
  );
};

export default Settings;