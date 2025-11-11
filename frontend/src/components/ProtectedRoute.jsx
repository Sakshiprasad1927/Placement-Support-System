import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute
 * - Wrap pages that require authentication
 * - Optionally restrict by `role` (string, e.g. 'student' or 'company')
 */
export default function ProtectedRoute({ children, role }){
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  if(!token) return <Navigate to="/" replace />
  if(role && userRole !== role) return <Navigate to="/" replace />
  return children
}
