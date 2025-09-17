import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';
import Avatar from './Avatar';
import './UserProfile.css';

const UserProfile = () => {
  const { user, logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  if (!user) return null;

  return (
    <div className="user-profile">
      <div className="user-info">
        <span className="user-name">{user.name || user.email}</span>
        <Avatar 
          image={user.picture} 
          alt={user.name || user.email}
          size={40}
        />
      </div>
      <button 
        className="logout-button"
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};

export default UserProfile;
