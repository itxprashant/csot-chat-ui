// create a registration page with a form that has fields for username, email, and password
import React from 'react';
import { Link } from 'react-router-dom';

export function RegisterPage() {
    function submitHandler(event) {
        event.preventDefault();

        const form = event.target;
        const username = form.username.value;
        const email = form.email.value;
        const password = form.password.value;


        // fetch(`${process.env.REACT_APP_API_URL}/auth/register`, {
        fetch(`http://localhost:8000/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
            },
            body: JSON.stringify({ name:username, email: email, password: password }),
        }).then(response => {
            if (response.ok) {
                alert('Registration successful');
            } else if (response.status === 400) {
                alert('Bad request, please check your input');
            } else {
                alert('An error occurred during registration');
            }
        }).catch(error => {
            console.error('Error during fetch:', error);
            alert('Failed to connect to the server. Please try again later.');
        });

    }

    // Render the registration form
    return (
        <div className="RegisterPage">
            <header className="Register-header">
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    background: 'linear-gradient(to right, red, blue)', 
                    padding: '20px', 
                    borderRadius: '10px' 
                }}>
                    <h2 style={{ color: 'white', marginBottom: '20px' }}>Register</h2>
                    <form onSubmit={submitHandler}>
                        <label>
                            Username:
                            <span style={{ marginRight: '10px' }} />
                            <input type="text" name="username" required />
                        </label>
                        <br />
                        <label>
                            Email:
                            <span style={{ marginRight: '10px' }} />
                            <input type="email" name="email" required />
                        </label>
                        <br />
                        <label>
                            Password:
                            <span style={{ marginRight: '10px' }} />
                            <input type="password" name="password" required />
                        </label>
                        <br />
                        <br />
                        <button type="submit" style={{
                            backgroundColor: 'green',
                            color: 'white',
                            fontSize: '20px',
                            padding: '10px 20px',
                        }}>Register</button>
                    </form>
                    
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/">
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
                                Back to Login
                            </button>
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );

}