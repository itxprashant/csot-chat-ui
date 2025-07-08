// create a registration page with a form that has fields for username, email, and password
import React from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

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
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h1>Join ChatUI</h1>
                    <p>Create your account to start chatting</p>
                </div>
                
                <form className="register-form" onSubmit={submitHandler}>
                    <div className="form-group required">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username"
                            className="form-input"
                            placeholder="Enter your username"
                            required 
                        />
                    </div>
                    
                    <div className="form-group required">
                        <label htmlFor="email">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            id="email"
                            className="form-input"
                            placeholder="Enter your email"
                            required 
                        />
                    </div>
                    
                    <div className="form-group required">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password"
                            className="form-input"
                            placeholder="Create a strong password"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="submit-button">
                        Create Account
                    </button>
                </form>

                <div className="divider">
                    <span>Already have an account?</span>
                </div>

                <div className="login-link">
                    <Link to="/" className="login-button">
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    );

}