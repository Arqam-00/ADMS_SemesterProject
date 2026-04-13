import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCitizenProfile, getParents, createApplication } from '../services/api';
import toast from 'react-hot-toast';
import FamilyTree from '../components/FamilyTree';

const CitizenDashboard = () => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [parents, setParents] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationType, setApplicationType] = useState('new');
  const [correctionDetails, setCorrectionDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, parentsRes] = await Promise.all([
        getCitizenProfile(user.cnic),
        getParents(user.cnic)
      ]);
      setProfile(profileRes.data);
      setParents(parentsRes.data);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    if (applicationType === 'correction' && !correctionDetails.trim()) {
      toast.error('Please specify what information needs to be corrected');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const applicationData = {
        citizen_cnic: user.cnic,
        application_type: applicationType
      };
      
      if (applicationType === 'correction') {
        applicationData.correction_details = correctionDetails;
      }
      
      const response = await createApplication(applicationData);
      
      toast.success(`Application #${response.data.application_id} submitted successfully!`);
      setShowApplicationForm(false);
      setApplicationType('new');
      setCorrectionDetails('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Application submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getApplicationFee = () => {
    switch(applicationType) {
      case 'new': return '5,000';
      case 'renewal': return '5,000';
      case 'replacement': return '7,000';
      case 'correction': return '3,000';
      default: return '5,000';
    }
  };

  const getApplicationDescription = () => {
    switch(applicationType) {
      case 'new': return 'First time ID card issuance';
      case 'renewal': return 'Renew expiring ID card';
      case 'replacement': return 'Replace lost or damaged ID card';
      case 'correction': return 'Update incorrect information on ID card';
      default: return '';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your profile...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Citizen Dashboard</h1>
        <button onClick={logout} style={styles.logoutBtn}>Logout</button>
      </div>

      {/* Row 1: Profile and Parents */}
      <div style={styles.grid}>
        {/* Profile Card */}
        <div style={styles.card}>
          <h2>📋 My Profile</h2>
          {profile && (
            <div>
              <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
              <p><strong>CNIC:</strong> {profile.cnic}</p>
              <p><strong>Gender:</strong> {profile.gender}</p>
              <p><strong>Date of Birth:</strong> {new Date(profile.date_of_birth).toLocaleDateString()}</p>
              {profile.date_of_death && <p><strong>Date of Death:</strong> {new Date(profile.date_of_death).toLocaleDateString()}</p>}
            </div>
          )}
        </div>

        {/* Parents Card */}
        <div style={styles.card}>
          <h2>👪 Parents Information</h2>
          {parents ? (
            <div>
              <p><strong>Father CNIC:</strong> {parents.father_cnic || 'Not recorded'}</p>
              <p><strong>Mother CNIC:</strong> {parents.mother_cnic || 'Not recorded'}</p>
            </div>
          ) : (
            <p>Parent information not available</p>
          )}
        </div>
      </div>

      {/* Row 2: Application and Transaction Demo */}
      <div style={styles.grid}>
        {/* Application Card */}
        <div style={styles.card}>
          <h2>🪪 ID Card Application</h2>
          {!showApplicationForm ? (
            <button onClick={() => setShowApplicationForm(true)} style={styles.button}>
              Apply for ID Card
            </button>
          ) : (
            <form onSubmit={handleSubmitApplication}>
              <div style={styles.formGroup}>
                <label>Application Type:</label>
                <select 
                  value={applicationType} 
                  onChange={(e) => {
                    setApplicationType(e.target.value);
                    setCorrectionDetails('');
                  }}
                  style={styles.select}
                >
                  <option value="new">New ID Card</option>
                  <option value="renewal">Renewal</option>
                  <option value="replacement">Replacement</option>
                  <option value="correction">Correction</option>
                </select>
                <p style={styles.description}>{getApplicationDescription()}</p>
              </div>

              {applicationType === 'correction' && (
                <div style={styles.formGroup}>
                  <label>What needs to be corrected? <span style={styles.required}>*</span></label>
                  <textarea
                    value={correctionDetails}
                    onChange={(e) => setCorrectionDetails(e.target.value)}
                    placeholder="Example: Change name from 'Ali' to 'Ali Ahmed' OR Update date of birth from 01-01-2000 to 15-03-2000"
                    style={styles.textarea}
                    rows="3"
                    required
                  />
                  <p style={styles.hint}>Please provide exact details of what information needs to be corrected.</p>
                </div>
              )}

              <div style={styles.formGroup}>
                <p><strong>Fee:</strong> Rs. {getApplicationFee()}</p>
                <p><strong>Payment Method:</strong> Cash (at nearest NADRA branch)</p>
                <p><strong>Processing Time:</strong> 7-10 business days</p>
              </div>

              <div style={styles.buttonGroup}>
                <button type="submit" disabled={submitting} style={styles.button}>
                  {submitting ? 'Processing...' : 'Submit Application'}
                </button>
                <button type="button" onClick={() => {
                  setShowApplicationForm(false);
                  setApplicationType('new');
                  setCorrectionDetails('');
                }} style={styles.cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Transaction Demo Info */}
        <div style={styles.card}>
          <h2>⚡ ACID Transaction Demo</h2>
          <p>When you submit an application:</p>
          <ul>
            <li>✓ Application record is created</li>
            <li>✓ Payment record is created automatically</li>
            <li>✓ Both operations happen in a single database transaction</li>
            <li>✓ If either fails, everything is rolled back</li>
          </ul>
          <p style={styles.note}>This demonstrates Atomicity - all or nothing!</p>
        </div>
      </div>

      {/* Row 3: Family Tree (Full Width) */}
      <div style={styles.familyTreeContainer}>
        <FamilyTree cnic={user.cnic} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '10px',
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  familyTreeContainer: {
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    marginLeft: '10px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  select: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    marginTop: '5px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontFamily: 'Arial, sans-serif',
    resize: 'vertical',
  },
  buttonGroup: {
    marginTop: '15px',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
  },
  note: {
    fontSize: '12px',
    color: '#666',
    marginTop: '10px',
    fontStyle: 'italic',
  },
  description: {
    fontSize: '12px',
    color: '#666',
    marginTop: '5px',
  },
  hint: {
    fontSize: '11px',
    color: '#888',
    marginTop: '5px',
  },
  required: {
    color: 'red',
  },
};

export default CitizenDashboard;