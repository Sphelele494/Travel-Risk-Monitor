import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import UserDashboard from './user-dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>  
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />    
        <Route path="/user-dashboard" element={<UserDashboard />} />   
      </Routes>
    </BrowserRouter>
  );
}

export default App;