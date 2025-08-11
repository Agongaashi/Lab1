import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import AboutPage from './pages/AboutPage';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import OrdersPage from './pages/OrdersPage';
import CartPage from "./pages/CartPage";
import AdminProductsPage from "./admin/AdminProductsPage";
import { getUserFromToken, getUserRole } from './services/authService';

function App() {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true); // <-- shtojmë loading

    useEffect(() => {
        const loggedUser = getUserFromToken();
        setUser(loggedUser);
        setRole(getUserRole());
        setLoading(false); // përfundojmë ngarkimin
    }, []);

    const isAuthenticated = !!user;

    if (loading) {
        // Gjatë ngarkimit, mund të shfaqësh loading spinner ose thjesht null
        return <div>Loading...</div>;
    }

    return (
        <Router>
            {isAuthenticated && <Navbar user={user} role={role} setUser={setUser} />}

            <Routes>
                <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} />} />

                <Route path="/login" element={<LoginPage setUser={setUser} />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
                <Route path="/products" element={isAuthenticated ? <ShopPage /> : <Navigate to="/login" />} />
                <Route path="/products/:categoryId" element={isAuthenticated ? <ShopPage /> : <Navigate to="/login" />} />
                <Route path="/orders" element={isAuthenticated ? <OrdersPage /> : <Navigate to="/login" />} />
                <Route path="/about" element={isAuthenticated ? <AboutPage /> : <Navigate to="/login" />} />
                <Route path="/cart" element={isAuthenticated ? <CartPage /> : <Navigate to="/login" />} />

                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated && role === "admin"
                            ? <Dashboard />
                            : <Navigate to={isAuthenticated ? "/home" : "/login"} />
                    }
                />
                <Route
                    path="/admin/products"
                    element={
                        isAuthenticated && role === "admin"
                            ? <AdminProductsPage />
                            : <Navigate to={isAuthenticated ? "/home" : "/login"} />
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
