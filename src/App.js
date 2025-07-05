import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import { RegisterPage } from './registerPage';
import { ChatPage } from './chatPage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;