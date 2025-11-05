import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import CookbookPage from './pages/CookbookPage';
import UserProfile from './components/UserProfile';
import { setAuthData, clearAuthData } from './store/authSlice';
import { API_CONFIG } from './config/api';
import './App.css';


// the auth is being added as needed. Fix the data types for the recipes and reconnect all the API calls
function App() {
  const { 
    isLoading, 
    isAuthenticated, 
    user, 
    error,
    getAccessTokenSilently,
    getIdTokenClaims
  } = useAuth0();
	const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const cookbookPageRef = useRef(null);

  // Update Redux store with Auth0 data
  useEffect(() => {
    const updateAuthData = async () => {
      if (isAuthenticated) {
        try {
          // Get access token and ID token claims if authenticated
          const token = await getAccessTokenSilently();
          const idTokenClaims = await getIdTokenClaims();
          
          // Record user in database (fire and forget)
          const auth0Id = idTokenClaims.sub.split('|')[1];
          fetch(`${API_CONFIG.BASE_URL}/record-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              nickname: user.nickname,
              picture: user.picture,
              auth0Id
            })
          }).catch(err => console.error('Failed to record user:', err));
          
          dispatch(setAuthData({
            isAuthenticated,
            isLoading,
            user,
            error,
            token,
            idTokenClaims
          }));
        } catch (tokenError) {
          // If token retrieval fails, still update with basic auth data
          dispatch(setAuthData({
            isAuthenticated,
            isLoading,
            user,
            error: tokenError,
            token: null,
            idTokenClaims: null
          }));
        }
      } else if (isAuthenticated === false) {
        // Clear auth data when not authenticated
        dispatch(clearAuthData());
      } else {
        // Handle loading state
        dispatch(setAuthData({
          isAuthenticated,
          isLoading,
          user,
          error,
          token: null,
          idTokenClaims: null
        }));
      }
    };

    updateAuthData();
  }, [isAuthenticated]);

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
          element={authState.isAuthenticated ? <CookbookPage ref={cookbookPageRef} /> : <LoginPage />} 
        />
      </Routes>
    </div>
  );
}

export default App;