import React from 'react';
import { FaGoogle, FaSignOutAlt, FaUser, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../Button/Button';
import { isFirebaseConfigured } from '../../firebase';
import './Auth.css';

const Auth = ({ user, onSignIn, onSignOut }) => {
  if (!isFirebaseConfigured) {
    return (
      <div className="auth-container">
        <div className="firebase-warning">
          <FaExclamationTriangle className="warning-icon" />
          <span>Firebase not configured</span>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="auth-container">
        <div className="user-info">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Profile" 
              className="profile-pic"
            />
          ) : (
            <div className="profile-placeholder">
              <FaUser />
            </div>
          )}
          <span className="user-name">{user.displayName || user.email}</span>
        </div>
        <Button 
          variant="secondary" 
          onClick={onSignOut}
          icon={<FaSignOutAlt />}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="primary" 
      onClick={onSignIn}
      icon={<FaGoogle />}
    >
      Sign in with Google
    </Button>
  );
};

export default Auth;