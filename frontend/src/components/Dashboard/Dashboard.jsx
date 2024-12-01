import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import BookList from '../Dashboard/Book/BookList';
import AddBook from '../Dashboard/Book/AddBook';
import ManageUsers from '../Dashboard/ManageUser/ManageUsers';
import useUserStore from '../../store/userStore';
import AnalyticsDashboard from '../Dashboard/Analytics/AnalyticsDashboard'; 
import AnalyticsUsers  from  '../Dashboard/Analytics/AnalyticsUsers';

const Dashboard = () => {
  const { stats, fetchUsers, fetchBooks } = useUserStore();
  const [activeSection, setActiveSection] = useState('welcome');

  useEffect(() => {
    fetchUsers();
    fetchBooks();
  }, [fetchUsers, fetchBooks]);

  const renderContent = () => {
    switch (activeSection) {
      case 'bookList':
        return <BookList />;
      case 'addBook':
        return <AddBook />;
      case 'manageUsers':
        return <ManageUsers />;
      case 'analytics':
        return <AnalyticsDashboard />; 
      case 'useranalytics':
        return <AnalyticsUsers/>;
      default:
        return (
          <div className="welcome-section">
            <h2>Welcome, Admin!</h2>
            <div className="stats">
              <p>Total Books: {stats.books}</p>
              <p>Total Users: {stats.users}</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <button onClick={() => setActiveSection('welcome')}>Dashboard</button>
        <button onClick={() => setActiveSection('bookList')}>Book List</button>
        <button onClick={() => setActiveSection('addBook')}>Add Book</button>
        <button onClick={() => setActiveSection('manageUsers')}>Manage Users</button>
        <button onClick={() => setActiveSection('analytics')}>Analytics</button> 
        <button onClick={() => setActiveSection('useranalytics')}>UserAnalytics</button> 
      </div>

      {/* Main Content */}
      <div className="main-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
