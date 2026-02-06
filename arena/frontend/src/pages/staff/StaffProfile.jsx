import React from 'react';
import { UserCircle } from 'lucide-react';

const StaffProfile = () => {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold mb-2">
        Staff Profile <span className="text-gradient">Page</span>
      </h1>
      <p className="text-dark-600 mb-6">View and manage your profile</p>

      <div className="text-dark-800">
        <UserCircle className="h-12 w-12 mx-auto mb-4 text-primary-500" />
        <p>Staff profile features coming soon...</p>
      </div>
    </div>
  );
};

export default StaffProfile;
