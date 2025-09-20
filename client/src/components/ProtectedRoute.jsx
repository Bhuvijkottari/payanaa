// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  // If the auth context is not yet available
  if (!auth) return null;

  const { currentUser, loading } = auth;

  // Show a loading message while Firebase initializes
  if (loading) return <div>Loading...</div>;

  // Redirect to login if user is not authenticated
  if (!currentUser) return <Navigate to="/login" replace />;

  // Render protected content if authenticated
  return children;
}
