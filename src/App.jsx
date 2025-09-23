import React, { useState } from 'react';
import { useAppContext } from './contexts/AppContext';
import { useLinks } from './hooks/useLinks';
import { useSearch } from './hooks/useSearch';
import { useImportExport } from './hooks/useImportExport';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, isFirebaseConfigured } from './firebase';
import { 
  Sidebar, 
  Header, 
  AddCategoryForm, 
  Category, 
  Welcome 
} from './components';
import './components/components.css';
import './App.css';

function App() {
  const { user, loading } = useAppContext();
  const { links, addCategory, addLink, deleteLink, deleteCategory } = useLinks();
  const { 
    searchTerm, 
    setSearchTerm, 
    searchEngine, 
    setSearchEngine, 
    searchEngines, 
    filteredItems,
    performSearch
  } = useSearch(links);
  const { exportData, importData } = useImportExport();
  const [authError, setAuthError] = useState(null);

  const handleSignIn = async () => {
    // Check if Firebase is configured
    if (!isFirebaseConfigured) {
      setAuthError('Firebase is not properly configured. Please check your .env file.');
      return;
    }
    
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setAuthError(null);
    } catch (error) {
      console.error('Error signing in:', error);
      // Handle specific Firebase errors
      if (error.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in request was cancelled. Please try again.');
      } else if (error.code === 'auth/invalid-api-key') {
        setAuthError('Invalid Firebase API key. Please check your configuration.');
      } else {
        setAuthError(`Authentication error: ${error.message}`);
      }
    }
  };

  const handleSignOut = async () => {
    if (!isFirebaseConfigured) {
      setAuthError('Firebase is not properly configured.');
      return;
    }
    
    try {
      await signOut(auth);
      setAuthError(null);
    } catch (error) {
      console.error('Error signing out:', error);
      setAuthError(`Sign out error: ${error.message}`);
    }
  };

  // Handle import
  const handleImport = (event) => {
    importData(event);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="app-main">
        <Header 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchEngine={searchEngine}
          setSearchEngine={setSearchEngine}
          searchEngines={searchEngines}
          onSearch={performSearch}
          user={user}
          onSignIn={handleSignIn}
          onSignOut={handleSignOut}
        />
        <main className="app-content">
          {authError && (
            <div className="error-banner">
              <p>{authError}</p>
              <button onClick={() => setAuthError(null)}>Dismiss</button>
            </div>
          )}
          
          {!isFirebaseConfigured && (
            <div className="warning-banner">
              <p>Firebase is not configured. Please add your Firebase configuration to the .env file to enable authentication and data persistence.</p>
            </div>
          )}
          
          {user ? (
            <>
              <AddCategoryForm onAddCategory={addCategory} />
              <div className="categories-grid">
                {filteredItems.map((category) => (
                  <Category
                    key={category.id}
                    category={category}
                    onAddLink={addLink}
                    onDeleteLink={deleteLink}
                    onDeleteCategory={deleteCategory}
                  />
                ))}
              </div>
              {filteredItems.length === 0 && searchTerm && (
                <div className="no-results">
                  <p>No categories or links found matching "{searchTerm}"</p>
                </div>
              )}
            </>
          ) : (
            <Welcome onSignIn={handleSignIn} />
          )}
        </main>
      </div>
      {/* Hidden import input */}
      <input 
        type="file" 
        id="import-input" 
        style={{ display: 'none' }} 
        accept=".json"
        onChange={handleImport}
      />
    </div>
  );
}

export default App;
