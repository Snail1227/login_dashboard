import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Create and import this CSS file

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1>Welcome</h1>
        <button onClick={() => navigate('/login')} className="landing-button">Login</button>
        <button onClick={() => navigate('/signup')} className="landing-button">Signup</button>
      </div>
    </div>
  );
};

export default LandingPage;
