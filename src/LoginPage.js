import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <div className="App">
      <header className="App-header">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          background: 'linear-gradient(to right, red, blue)', 
          padding: '20px', 
          borderRadius: '10px' 
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Login</h2>
          <form onSubmit={submitHandler}>
            <label>
              Email: 
              <span style={{ marginRight: '10px' }} />
              <input type="text" name="username" />
            </label>
            <br />
            <label>
              Password:
              <span style={{ marginRight: '10px' }} />
              <input type="password" name="password" />
            </label>
            <br/>
            <br/>
            <button style={{
              backgroundColor: 'green',
              color: 'white',
              justifyContent: 'center',
              alignContent: 'center',
              fontSize: '20px',
              padding: '10px 20px',
            }}>
              Submit
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Link to="/register">
              <button
                style={{
                  backgroundColor: 'blue',
                  color: 'white',
                  fontSize: '18px',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Register
              </button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default LoginPage;
