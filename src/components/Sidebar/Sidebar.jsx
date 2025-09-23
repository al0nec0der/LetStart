import React from 'react';
import { FaHome, FaStar, FaHistory, FaCog } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-logo">
        <span className="logo-text">LS</span>
      </div>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item active">
            <a href="#" className="nav-link">
              <FaHome className="nav-icon" />
              <span className="nav-text">Home</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <FaStar className="nav-icon" />
              <span className="nav-text">Favorites</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <FaHistory className="nav-icon" />
              <span className="nav-text">History</span>
            </a>
          </li>
          <li className="nav-item">
            <a href="#" className="nav-link">
              <FaCog className="nav-icon" />
              <span className="nav-text">Settings</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;