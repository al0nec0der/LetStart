import React from 'react';
import { FaLink, FaGoogle, FaExclamationTriangle } from 'react-icons/fa';
import Button from '../Button/Button';
import { isFirebaseConfigured } from '../../firebase';
import './Welcome.css';

const Welcome = ({ onSignIn }) => {
  if (!isFirebaseConfigured) {
    return (
      <div className="welcome-container">
        <div className="welcome-content">
          <div className="welcome-icon">
            <FaExclamationTriangle />
          </div>
          <h1 className="welcome-title">Firebase Not Configured</h1>
          <p className="welcome-description">
            Please add your Firebase configuration to the .env file to enable authentication and data persistence.
          </p>
          <div className="setup-instructions">
            <h3>Setup Instructions:</h3>
            <ol>
              <li>Create a Firebase project at <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer">Firebase Console</a></li>
              <li>Copy your project's configuration values</li>
              <li>Create a .env file in the project root</li>
              <li>Add your Firebase configuration to the .env file</li>
              <li>Restart the development server</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-icon">
          <FaLink />
        </div>
        <h1 className="welcome-title">Welcome to LinkStart</h1>
        <p className="welcome-description">
          Organize your favorite links in one place. Sign in to get started.
        </p>
        <Button 
          variant="primary" 
          onClick={onSignIn}
          icon={<FaGoogle />}
          size="large"
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Welcome;