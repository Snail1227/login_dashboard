import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = ({ token }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch('http://localhost:3001/user', {
        headers: {
          Authorization: token,
        },
      });
      const data = await response.json();
      setUser(data);
    };

    fetchUser();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="sidebar">
        <div className="sidebar-header">
          <h3>Dashboard</h3>
        </div>
        <ul className="sidebar-menu">
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#profile">Profile</a></li>
          <li><a href="#settings">Settings</a></li>
          <li><a href="#notifications">Notifications</a></li>
          <li><a href="#monitor">Monitor</a></li>
        </ul>
      </nav>
      <div className="content">
        <header className="header">
          {user && <span className="user-info">👤 {user.name}</span>}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </header>
        <main>
          <h2>I am the main content</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
