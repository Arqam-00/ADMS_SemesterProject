import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOfficerWorkload, getApplicationStats, getMonthlyTrend, getBranchStats } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [workload, setWorkload] = useState([]);
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [branchData, setBranchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [workloadRes, statsRes, monthlyRes, branchRes] = await Promise.all([
        getOfficerWorkload(),
        getApplicationStats(),
        getMonthlyTrend(),
        getBranchStats()
      ]);
      
      setWorkload(workloadRes.data);
      setStats(statsRes.data);
      setMonthlyData(monthlyRes.data);
      setBranchData(branchRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statusData = stats ? [
    { name: 'Approved', value: stats.approved || 0, color: '#28a745' },
    { name: 'Pending', value: stats.pending || 0, color: '#ffc107' },
    { name: 'Processing', value: stats.processing || 0, color: '#17a2b8' },
    { name: 'Rejected', value: stats.rejected || 0, color: '#dc3545' },
  ] : [];

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('overview')} style={activeTab === 'overview' ? styles.activeTab : styles.tab}>Overview</button>
        <button onClick={() => setActiveTab('analytics')} style={activeTab === 'analytics' ? styles.activeTab : styles.tab}>Analytics</button>
        <button onClick={() => setActiveTab('officers')} style={activeTab === 'officers' ? styles.activeTab : styles.tab}>Officers Workload</button>
      </div>

      {activeTab === 'overview' && stats && (
        <div>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><h3>Total Applications</h3><p style={styles.statNumber}>{stats.total || 0}</p></div>
            <div style={styles.statCard}><h3>Pending</h3><p style={styles.statNumber}>{stats.pending || 0}</p></div>
            <div style={styles.statCard}><h3>Approved</h3><p style={styles.statNumber}>{stats.approved || 0}</p></div>
            <div style={styles.statCard}><h3>Processing</h3><p style={styles.statNumber}>{stats.processing || 0}</p></div>
          </div>

          <div style={styles.chartsGrid}>
            <div style={styles.chartCard}>
              <h3>Application Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                    {statusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={styles.chartCard}>
              <h3>Monthly Applications Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#8884d8" />
                  <Line type="monotone" dataKey="approved" stroke="#28a745" />
                  <Line type="monotone" dataKey="rejected" stroke="#dc3545" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div>
          <div style={styles.chartCard}>
            <h3>Applications by Branch</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" fill="#8884d8" />
                <Bar dataKey="officers" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.insightsCard}>
            <h3>Key Insights</h3>
            <ul>
              <li>✅ Approval rate: {stats ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%</li>
              <li>⚠️ Pending applications: {stats?.pending || 0}</li>
              <li>🏆 Top branch: {branchData.length > 0 ? branchData.reduce((max, b) => b.applications > max.applications ? b : max, branchData[0]).name : 'N/A'}</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'officers' && (
        <div style={styles.tableCard}>
          <h3>Officers Workload</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead><tr style={styles.tableHeader}><th style={styles.th}>Employee ID</th><th style={styles.th}>Total Applications</th><th style={styles.th}>Status</th></tr></thead>
              <tbody>
                {workload.length === 0 ? (<tr><td colSpan="3" style={styles.td}>No officers found</td></tr>) : (
                  workload.map((officer, index) => (
                    <tr key={index} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.td}>{officer.employee_id}</td>
                      <td style={styles.td}>{officer.total_applications}</td>
                      <td style={styles.td}><span style={{...styles.statusBadge, backgroundColor: officer.total_applications > 10 ? '#dc3545' : '#28a745'}}>{officer.total_applications > 10 ? 'High Load' : 'Normal'}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid #ddd', paddingBottom: '10px' },
  tab: { padding: '10px 20px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  activeTab: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
  statCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', textAlign: 'center', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  statNumber: { fontSize: '36px', fontWeight: 'bold', margin: '10px 0', color: '#1a73e8' },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginBottom: '30px' },
  chartCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  insightsCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#e8f4fd', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tableCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tableWrapper: { overflowX: 'auto', marginTop: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '400px' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' },
  td: { padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' },
  tableRowEven: { backgroundColor: '#fff' },
  tableRowOdd: { backgroundColor: '#f9f9f9' },
  statusBadge: { padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px', display: 'inline-block' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' },
};

export default AdminDashboard;