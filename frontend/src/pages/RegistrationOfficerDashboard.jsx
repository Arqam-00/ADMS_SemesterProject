import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getPendingApplications, getAllApplications, issueIDCard, getCitizenInfo } from '../services/api';
import toast from 'react-hot-toast';

const RegistrationOfficerDashboard = () => {
  const { logout } = useAuth();
  const [pendingApps, setPendingApps] = useState([]);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [citizenInfo, setCitizenInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pendingRes, allRes] = await Promise.all([
        getPendingApplications(),
        getAllApplications()
      ]);
      setPendingApps(pendingRes.data);
      setAllApps(allRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueCard = async (applicationId) => {
    try {
      const response = await issueIDCard(applicationId);
      toast.success(`ID Card Issued! Card Number: ${response.data.card_number}`);
      fetchData();
      setShowModal(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to issue card');
    }
  };

  const handleViewCitizen = async (cnic) => {
    try {
      const response = await getCitizenInfo(cnic);
      setCitizenInfo(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load citizen information');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: '#ffc107',
      processing: '#17a2b8',
      approved: '#28a745',
      rejected: '#dc3545'
    };
    return { backgroundColor: colors[status] || '#6c757d', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px' };
  };

  if (loading) {
    return <div style={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Registration Officer Dashboard</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.statsCard}>
        <h3>Pending Issuance: {pendingApps.length} applications</h3>
        <p>Approved applications waiting for ID card issuance</p>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('pending')} style={activeTab === 'pending' ? styles.activeTab : styles.tab}>
          Pending Issuance ({pendingApps.length})
        </button>
        <button onClick={() => setActiveTab('all')} style={activeTab === 'all' ? styles.activeTab : styles.tab}>
          All Applications
        </button>
      </div>

      {activeTab === 'pending' && (
        <div style={styles.tableCard}>
          <h3>Approved Applications - Ready for ID Card Issuance</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Citizen CNIC</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Submitted</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingApps.length === 0 ? (
                  <tr><td colSpan="7" style={styles.td}>No pending applications</td></tr>
                ) : (
                  pendingApps.map((app, index) => (
                    <tr key={app.application_id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.td}>{app.application_id}</td>
                      <td style={styles.td}>{app.citizen_cnic}</td>
                      <td style={styles.td}>{app.first_name} {app.last_name}</td>
                      <td style={styles.td}>{app.application_type}</td>
                      <td style={styles.td}><span style={{...getStatusBadge(app.payment_status), backgroundColor: '#28a745'}}>Paid</span></td>
                      <td style={styles.td}>{new Date(app.submitted_at).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <button onClick={() => handleViewCitizen(app.citizen_cnic)} style={styles.viewBtn}>View</button>
                        <button onClick={() => handleIssueCard(app.application_id)} style={styles.issueBtn}>Issue Card</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div style={styles.tableCard}>
          <h3>All Applications History</h3>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Citizen CNIC</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Card Number</th>
                  <th style={styles.th}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {allApps.length === 0 ? (
                  <tr><td colSpan="7" style={styles.td}>No applications found</td></tr>
                ) : (
                  allApps.map((app, index) => (
                    <tr key={app.application_id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                      <td style={styles.td}>{app.application_id}</td>
                      <td style={styles.td}>{app.citizen_cnic}</td>
                      <td style={styles.td}>{app.first_name} {app.last_name}</td>
                      <td style={styles.td}>{app.application_type}</td>
                      <td style={styles.td}><span style={getStatusBadge(app.status)}>{app.status}</span></td>
                      <td style={styles.td}>{app.card_number || 'Not issued'}</td>
                      <td style={styles.td}>{new Date(app.submitted_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && citizenInfo && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Citizen Information</h2>
            <div style={styles.modalContent}>
              <p><strong>CNIC:</strong> {citizenInfo.cnic}</p>
              <p><strong>Name:</strong> {citizenInfo.first_name} {citizenInfo.last_name}</p>
              <p><strong>Gender:</strong> {citizenInfo.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(citizenInfo.date_of_birth).toLocaleDateString()}</p>
              {citizenInfo.date_of_death && <p><strong>Date of Death:</strong> {new Date(citizenInfo.date_of_death).toLocaleDateString()}</p>}
              <p><strong>Address:</strong> {citizenInfo.formatted_address || 'Not recorded'}</p>
              {citizenInfo.landmark && <p><strong>Landmark:</strong> {citizenInfo.landmark}</p>}
            </div>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>Close</button>
            </div>
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
  statsCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', marginBottom: '20px', backgroundColor: '#e8f4fd' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '20px' },
  tab: { padding: '10px 20px', backgroundColor: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  activeTab: { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  tableCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tableWrapper: { overflowX: 'auto', marginTop: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' },
  td: { padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' },
  tableRowEven: { backgroundColor: '#fff' },
  tableRowOdd: { backgroundColor: '#f9f9f9' },
  viewBtn: { padding: '5px 10px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  issueBtn: { padding: '5px 10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%' },
  modalContent: { marginBottom: '20px' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  closeBtn: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' },
};

export default RegistrationOfficerDashboard;