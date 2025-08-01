import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserFromToken } from '../utils/auth';

export default function ProtectedRoute({ children, roleRequired }) {
    const user = getUserFromToken();

    if (!user) return <Navigate to="/login" />;

    if (roleRequired && user.role !== roleRequired) return <Navigate to="/unauthorized" />;

    return children;
}