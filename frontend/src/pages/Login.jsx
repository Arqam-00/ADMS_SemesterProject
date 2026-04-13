import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const user = await login(email, password);
      toast.success('Login successful!');
      
      // Redirect based on role
      switch(user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'citizen':
          navigate('/citizen');
          break;
        case 'verification_officer':
          navigate('/verification-officer');
          break;
        case 'registration_officer':
          navigate('/registration-officer');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Citizen Identity Management</h1>
        <h2 style={styles.subtitle}>Login</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p style={styles.registerLink}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
        
        <p style={styles.testCredentials}>
          <strong>Test Credentials:</strong><br />
          Admin: admin@nadra.gov.pk / password123<br />
          Citizen: ali.iqbal@example.com / password123<br />
          Verification Officer: bilal.rahman@nadra.gov.pk / password123<br />
          Registration Officer: ahmed.iqbal@nadra.gov.pk / password123
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '400px',
  },
  title: {
    textAlign: 'center',
    color: '#1a73e8',
    marginBottom: '10px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  registerLink: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
  },
  link: {
    color: '#1a73e8',
    textDecoration: 'none',
  },
  testCredentials: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#666',
    textAlign: 'center',
  },
};

export default Login;