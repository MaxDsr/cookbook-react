import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import LoginPage from './pages/LoginPage';
import CookbookPage from './pages/CookbookPage';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {isAuthenticated && (
        <header className="app-header">
          <h1>My Recipe Cookbook</h1>
          <UserProfile />
        </header>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <CookbookPage /> : <LoginPage />} 
        />
      </Routes>
    </div>
  );
}

export default App;