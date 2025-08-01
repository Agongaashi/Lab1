import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AdminRolesPage from './admin/AdminRolesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminNavbar from './admin/AdminNavbar';

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/roles" element={<ProtectedRoute roleRequired="Admin"><><AdminNavbar /><AdminRolesPage /></></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;