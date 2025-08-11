import React, { useState } from 'react';
import { login, getUserFromToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function LoginPage({ setUser }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!email || !password) {
                setError("Please enter both email and password.");
                setLoading(false);
                return;
            }

            await login({ email, password });
            const user = getUserFromToken();
            setUser(user);  // Përditëson gjendjen e user-it në App.js

            if (user?.role === "Admin") {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err) {
            setError("Login failed. Check your credentials.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <a href="/register" className="text-purple-600 hover:underline">Register</a>
                </p>
            </div>
        </div>
    );
}
