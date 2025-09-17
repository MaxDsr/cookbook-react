import React, { useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Plus } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import CookbookPage from './pages/CookbookPage';
import UserProfile from './components/UserProfile';
import './App.css';

function App() {
  const { isLoading, isAuthenticated } = useAuth0();
  const cookbookPageRef = useRef(null);

  const handleCreateNewRecipe = () => {
    if (cookbookPageRef.current) {
      cookbookPageRef.current.handleCreateNewRecipe();
    }
  };

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
          <div className="header-actions">
            <button 
              className="create-recipe-btn"
              onClick={handleCreateNewRecipe}
            >
              <Plus size={18} />
              <span>Create Recipe</span>
            </button>
            <UserProfile />
          </div>
        </header>
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <CookbookPage ref={cookbookPageRef} /> : <LoginPage />} 
        />
      </Routes>
    </div>
  );
}

export default App;