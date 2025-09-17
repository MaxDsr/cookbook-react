import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn } from 'lucide-react';
import './LoginPage.css';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = () => {
    loginWithRedirect();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1>Welcome to Cookbook</h1>
          <p>You are not logged in</p>
          <button 
            className="login-button"
            onClick={handleLogin}
          >
            <LogIn size={20} />
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
