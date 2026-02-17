import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const CustomerSettings = () => {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold mb-2">
        Settings <span className="text-gradient">Page</span>
      </h1>
      <p className="text-dark-600 mb-6">Manage your account preferences</p>

      <div className="text-dark-800">
        <SettingsIcon className="h-12 w-12 mx-auto mb-4 text-primary-500" />
        <p>Customer settings features coming soon...</p>
      </div>
    </div>
  );
};

export default CustomerSettings;
