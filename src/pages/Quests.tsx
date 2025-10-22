import React from 'react';

const Quests: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">Missões</h2>
      <p className="text-lg text-gray-600 dark:text-gray-400">Acompanhe suas missões ativas e completadas.</p>
    </div>
  );
};

export default Quests;