import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginPage.css';

function LoginPage() {
  const navigate = useNavigate();

  function submitHandler(event) {
    // get the username
    event.preventDefault();

    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    // get post request status
    fetch(`http://localhost:8000/api/auth/login`, {
    // fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
      },
      body: JSON.stringify({ email: username, password: password }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          alert('User not found');
          throw new Error('User not found');
        } else if (response.status === 401) {
          alert('Incorrect password');
          throw new Error('Incorrect password');
        } else {
          alert('An error occurred');
          throw new Error('An error occurred');
        }
      })
      .then(data => {
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          email: username,
          name: data.name || username.split('@')[0], // Use name from response or email prefix
          id: data.id || username,
          status: 'online'
        }));

        // Set user status to online
        fetch(`http://localhost:8000/api/users/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
          },
          body: JSON.stringify({ email: username, status: 'online' }),
        });
        
        
        alert('Login successful');
        // Navigate to chat page
        navigate('/chat');
      })
      .catch(error => {
        console.error('Error during fetch:', error);
        if (error.message === 'Failed to fetch') {
          alert('Failed to connect to the server. Please try again later.');
        }
      });
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to ChatUI</p>
        </div>
        
        <form className="login-form" onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="username">Email Address</label>
            <input 
              type="email" 
              name="username" 
              id="username"
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button type="submit" className="submit-button">
            Sign In
          </button>
        </form>

        <div className="divider">
          <span>New to ChatUI?</span>
        </div>

        <div className="register-link">
          <Link to="/register" className="register-button">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
