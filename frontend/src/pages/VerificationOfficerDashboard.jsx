import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getVerificationApplications, verifyApplication, getApplicationDetails } from '../services/api';
import toast from 'react-hot-toast';

const VerificationOfficerDashboard = () => {
  const { logout } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getVerificationApplications();
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (appId) => {
    try {
      const response = await getApplicationDetails(appId);
      setSelectedApp(response.data);
      setShowModal(true);
    } catch (error) {
      toast.error('Failed to load application details');
    }
  };

  const handleVerify = async (appId, action) => {
    try {
      await verifyApplication(appId, action, remarks);
      toast.success(`Application ${action}d successfully`);
      setShowModal(false);
      setRemarks('');
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Verification failed');
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
    return <div style={styles.loading}>Loading applications...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Verification Officer Dashboard</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      <div style={styles.statsCard}>
        <h3>Pending Applications: {applications.filter(a => a.status === 'pending').length}</h3>
        <p>Review and verify citizen ID card applications</p>
      </div>

      <div style={styles.tableCard}>
        <h3>Applications for Verification</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Citizen CNIC</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Payment</th>
                <th style={styles.th}>Submitted</th>
                <th style={styles.th}>Action</th>
               </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr><td colSpan="8" style={styles.td}>No applications found</td></tr>
              ) : (
                applications.map((app, index) => (
                  <tr key={app.application_id} style={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}>
                    <td style={styles.td}>{app.application_id}</td>
                    <td style={styles.td}>{app.citizen_cnic}</td>
                    <td style={styles.td}>{app.first_name} {app.last_name}</td>
                    <td style={styles.td}>{app.application_type}</td>
                    <td style={styles.td}><span style={getStatusBadge(app.status)}>{app.status}</span></td>
                    <td style={styles.td}><span style={{...getStatusBadge(app.payment_status), backgroundColor: app.payment_status === 'completed' ? '#28a745' : '#ffc107'}}>{app.payment_status || 'pending'}</span></td>
                    <td style={styles.td}>{new Date(app.submitted_at).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleViewDetails(app.application_id)} style={styles.viewBtn}>Verify</button>
                    </td>
                   </tr>
                ))
              )}
            </tbody>
           </table>
        </div>
      </div>

      {/* Modal for Application Details */}
      {showModal && selectedApp && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>Application Details</h2>
            <div style={styles.modalContent}>
              <p><strong>Application ID:</strong> {selectedApp.application_id}</p>
              <p><strong>Citizen CNIC:</strong> {selectedApp.citizen_cnic}</p>
              <p><strong>Name:</strong> {selectedApp.first_name} {selectedApp.last_name}</p>
              <p><strong>Gender:</strong> {selectedApp.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedApp.date_of_birth).toLocaleDateString()}</p>
              <p><strong>Application Type:</strong> {selectedApp.application_type}</p>
              <p><strong>Current Status:</strong> <span style={getStatusBadge(selectedApp.status)}>{selectedApp.status}</span></p>
              <p><strong>Payment Amount:</strong> Rs. {selectedApp.amount}</p>
              <p><strong>Payment Status:</strong> {selectedApp.payment_status}</p>
              
              <div style={styles.formGroup}>
                <label>Remarks (optional):</label>
                <textarea 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)} 
                  style={styles.textarea}
                  placeholder="Add any verification notes..."
                />
              </div>
            </div>
            <div style={styles.modalButtons}>
              <button onClick={() => handleVerify(selectedApp.application_id, 'approve')} style={styles.approveBtn}>Approve</button>
              <button onClick={() => handleVerify(selectedApp.application_id, 'reject')} style={styles.rejectBtn}>Reject</button>
              <button onClick={() => { setShowModal(false); setRemarks(''); }} style={styles.closeBtn}>Close</button>
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
  tableCard: { border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  tableWrapper: { overflowX: 'auto', marginTop: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', minWidth: '800px' },
  tableHeader: { backgroundColor: '#f5f5f5' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd', fontWeight: 'bold' },
  td: { padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' },
  tableRowEven: { backgroundColor: '#fff' },
  tableRowOdd: { backgroundColor: '#f9f9f9' },
  viewBtn: { padding: '5px 10px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflowY: 'auto' },
  modalContent: { marginBottom: '20px' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'flex-end' },
  approveBtn: { padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  rejectBtn: { padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  closeBtn: { padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  formGroup: { marginBottom: '15px' },
  textarea: { width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', fontFamily: 'Arial, sans-serif', resize: 'vertical' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px' },
};

export default VerificationOfficerDashboard;