import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import api from '../../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    resolved: 0,
    categories: [],
    trends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setStats({
          total: 0,
          pending: 0,
          in_progress: 0,
          resolved: 0,
          categories: [],
          trends: []
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const pieData = {
    labels: (stats.categories || []).map(cat => cat.category),
    datasets: [{
      data: (stats.categories || []).map(cat => parseInt(cat.count)),
      backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444', '#10B981', '#8B5CF6', '#F97316'],
      borderWidth: 0
    }]
  };

  const lineData = {
    labels: (stats.trends || []).map(trend => {
      const date = new Date(trend.month);
      return date.toLocaleDateString('en-US', { month: 'short' });
    }),
    datasets: [
      {
        label: 'Total Complaints',
        data: (stats.trends || []).map(trend => parseInt(trend.total_complaints)),
        borderColor: '#3B82F6',
        backgroundColor: 'transparent',
        tension: 0.4
      },
      {
        label: 'Resolved Cases',
        data: (stats.trends || []).map(trend => parseInt(trend.resolved_complaints)),
        borderColor: '#F59E0B',
        backgroundColor: 'transparent',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, padding: 20 }
      }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of cybercrime complaint metrics and trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.total || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">All registered complaints</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.pending || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Awaiting assignment</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.in_progress || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Currently under investigation</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{(stats.resolved || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">Successfully closed cases</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complaints by Category</h3>
          <div className="h-80">
            {(stats.categories || []).length > 0 ? (
              <Pie data={pieData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-80">
            {(stats.trends || []).length > 0 ? (
              <Line data={lineData} options={lineOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No trend data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;