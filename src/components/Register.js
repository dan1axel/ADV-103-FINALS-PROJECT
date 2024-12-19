import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

import defaultBackground from './images/background.jpg';  // Default background image

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    } else {
      setErrorMessage('');
    }

    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        setServerError('');
        alert('Registration successful! You can now log in.');
        navigate('/'); // Redirect to login page
      } else {
        const errorData = await response.json();
        setServerError(errorData.detail || 'Registration failed.');
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setServerError('An unexpected error occurred. Please try again later.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: `url(${defaultBackground}) no-repeat center center fixed`, // Set background image
      backgroundSize: 'cover', // Ensure the background image covers the whole viewport
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '30px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background for the form
        borderRadius: '10px',
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '28px',
          marginBottom: '20px',
          fontWeight: '600',
          color: '#333',
        }}>Create an Account</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
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
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
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
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              outline: 'none',
              transition: 'border-color 0.3s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
            onBlur={(e) => e.target.style.borderColor = '#ccc'}
          />
          {errorMessage && <p style={{ color: '#FF5252', fontSize: '14px', fontWeight: '500' }}>{errorMessage}</p>}
          {serverError && <p style={{ color: '#FF5252', fontSize: '14px', fontWeight: '500' }}>{serverError}</p>}
          <button
            type="submit"
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              background: '#F1F1F1',
              color: '#333',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s, background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#E0E0E0')}
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#F1F1F1')}
          >
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
