import React, { useState } from 'react';
import { register } from '../services/authService';

export default function RegisterPage() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        roleName: 'User',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const { username, email, password, confirmPassword } = form;

        if (!email || !password || !username || !confirmPassword) {
            setError("Please fill in all fields.");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await register(form);
            window.location.href = '/login';
        } catch (err) {
            setError("Registration failed. Try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />

                    <select
                        name="roleName"
                        value={form.roleName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                    </select>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold transition duration-300"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-600">
                    Already have an account? <a href="/login" className="text-purple-600 hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}
