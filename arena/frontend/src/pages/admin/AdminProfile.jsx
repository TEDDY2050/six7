import React from 'react';
import { User } from 'lucide-react';

const AdminProfile = () => {
  return (
    <div>
      <h1 className="text-4xl font-display font-bold mb-2">
        Admin Profile <span className="text-gradient">Page</span>
      </h1>
      <p className="text-dark-600 mb-6">View and manage your admin profile</p>

      <div className="text-dark-800">
        <User className="h-12 w-12 mx-auto mb-4 text-primary-500" />
        <p>Admin profile features coming soon...</p>
      </div>
    </div>
  );
};

export default AdminProfile;
