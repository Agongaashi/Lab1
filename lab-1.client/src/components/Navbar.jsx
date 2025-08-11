import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from "../services/categoryService";

export default function Navbar({ user, role, setUser }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Error loading categories", error);
            }
        };
        loadCategories();
    }, []);

    const handleCategorySelect = (categoryId) => {
        if (categoryId) {
            navigate(`/products?categoryId=${categoryId}`);
        } else {
            navigate("/products");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
            <div className="flex gap-4 items-center">
                {role === "admin" && <Link to="/dashboard">Dashboard</Link>}
                {role === "admin" && <Link to="/admin/products">Admin Product</Link>}

                <Link to="/about">About</Link>
                <Link to="/home">Home</Link>
                <Link to="/products">Shop</Link>

                <select
                    className="bg-white text-black rounded px-2 py-1"
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    defaultValue=""
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <Link to="/orders">My Orders</Link>
                <Link to="/cart">Cart</Link>
            </div>

            <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </nav>
    );
}
