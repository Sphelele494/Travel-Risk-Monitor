import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login';
import UserDashboard from './user-dashboard';
import ProtectedRoute from "./protectedroute"; 
import NotFound from "./NotFound";
import SmartRoutesDashboard from "./SmartRoutesDashboard";
import { Toaster } from "sonner";

function App() {
  return (
    <>
    <Toaster position="top-right" richColors />
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* ✅ Protect this route */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <SmartRoutesDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
