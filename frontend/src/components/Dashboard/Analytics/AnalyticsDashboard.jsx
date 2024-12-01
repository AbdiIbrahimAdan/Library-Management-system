import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { FaBook, FaUsers, FaChartLine, FaExchangeAlt } from 'react-icons/fa';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalBooks: 0,
    activeUsers: 0,
    totalBorrowings: 0,
    returnRate: 0,
    categoryDistribution: [],
    borrowingTrends: [],
    popularBooks: [],
    userActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // week, month, year

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/analytics?timeRange=${timeRange}`, {
        withCredentials: true
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Library Analytics Dashboard</h2>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">
            <FaBook />
          </div>
          <div className="card-content">
            <h3>Total Books</h3>
            <p>{analytics.totalBooks}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaUsers />
          </div>
          <div className="card-content">
            <h3>Active Users</h3>
            <p>{analytics.activeUsers}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaExchangeAlt />
          </div>
          <div className="card-content">
            <h3>Total Borrowings</h3>
            <p>{analytics.totalBorrowings}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">
            <FaChartLine />
          </div>
          <div className="card-content">
            <h3>Return Rate</h3>
            <p>{analytics.returnRate}%</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Category Distribution */}
        <div className="chart-container">
          <h3>Book Categories Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.categoryDistribution}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {analytics.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Borrowing Trends */}
        <div className="chart-container">
          <h3>Borrowing Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.borrowingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="borrowings"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                stroke="#82ca9d"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Popular Books */}
        <div className="chart-container">
          <h3>Most Popular Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.popularBooks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="borrowCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* User Activity */}
        <div className="chart-container">
          <h3>User Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.userActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="activeUsers"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;