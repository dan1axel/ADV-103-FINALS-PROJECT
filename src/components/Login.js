import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import defaultBackground from './images/background.jpg';  // Default background image

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    try {
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        alert(`Welcome, ${username}!`);
        navigate('/recipes'); // Redirect to the recipe list page
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.detail}`);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `url(${defaultBackground}) no-repeat center center fixed`,  // Add background image
      backgroundSize: 'cover', // Make the background image cover the whole container
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',  // Semi-transparent background for the form
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          fontWeight: '600',
          color: '#333',
        }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2196F3')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #2196F3, #42A5F5)',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)')}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', color: '#333' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#2196F3', textDecoration: 'none', fontWeight: '500' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
