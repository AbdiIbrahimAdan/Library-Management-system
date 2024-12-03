import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Chart as ChartJS, ArcElement, BarElement, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import useUserStore from '../../../store/userStore';
import './AnalyticsUsers.css';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const AnalyticsUsers = () => {
  const { fetchAnalytics, analytics, loading, error } = useUserStore();
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const intervalRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      await fetchAnalytics();
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  }, [fetchAnalytics]);

  useEffect(() => {
    loadData();
    
    // Set up auto-refresh
    intervalRef.current = setInterval(loadData, refreshInterval);
    
    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loadData, refreshInterval]);

  const validateData = (data) => {
    return data && Array.isArray(data) && data.length > 0;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Analytics</h3>
        <p>{error}</p>
        <button onClick={loadData} className="retry-button">Retry</button>
      </div>
    );
  }

  const chartConfigs = {
    gender: {
      data: {
        labels: validateData(analytics.genderStats) 
          ? analytics.genderStats.map(stat => stat._id)
          : [],
        datasets: [{
          label: 'Gender Distribution',
          data: validateData(analytics.genderStats)
            ? analytics.genderStats.map(stat => stat.count)
            : [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      }
    },
    country: {
      data: {
        labels: validateData(analytics.countryStats)
          ? analytics.countryStats.map(stat => stat._id)
          : [],
        datasets: [{
          label: 'Users by Country',
          data: validateData(analytics.countryStats)
            ? analytics.countryStats.map(stat => stat.count)
            : [],
          backgroundColor: validateData(analytics.countryStats)
            ? analytics.countryStats.map(() => 
                `hsla(${Math.random() * 360}, 70%, 50%, 0.8)`
              )
            : [],
        }]
      }
    },
    age: {
      data: {
        labels: ['0-18', '19-30', '31-40', '41-50', '51-60', '60+'],
        datasets: [{
          label: 'Age Distribution',
          data: validateData(analytics.ageStats)
            ? analytics.ageStats.map(stat => stat.count)
            : [],
          borderColor: '#FF6384',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        }]
      }
    }
  };

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Admin Analytics Dashboard</h2>
        <select 
          value={refreshInterval} 
          onChange={(e) => setRefreshInterval(Number(e.target.value))}
          className="refresh-select"
        >
          <option value={60000}>Refresh: 1 minute</option>
          <option value={300000}>Refresh: 5 minutes</option>
          <option value={900000}>Refresh: 15 minutes</option>
        </select>
      </div>

      <div className="analytics-summary">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{analytics.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Countries</h3>
          <p>{analytics.countryStats?.length || 0}</p>
        </div>
      </div>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Gender Distribution</h3>
          <Pie data={chartConfigs.gender.data} options={commonOptions} />
        </div>
        
        <div className="chart-container">
          <h3>Top Countries</h3>
          <Bar 
            data={chartConfigs.country.data} 
            options={{
              ...commonOptions,
              indexAxis: 'y',
            }} 
          />
        </div>
        
        <div className="chart-container">
          <h3>Age Distribution</h3>
          <Line data={chartConfigs.age.data} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsUsers;