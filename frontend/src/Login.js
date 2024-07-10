import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css'; // Create and import this CSS file

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setToken(data.token);
      navigate('/dashboard');
    } else {
      setError(data.error);
    }
  };
  

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Login</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          className="auth-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="auth-input"
        />
        <button type="submit" className="auth-button">Login</button>
        <p className="auth-link">Not registered? <a href="/signup">Create an account</a></p>
      </form>
    </div>
  );
};

export default Login;
