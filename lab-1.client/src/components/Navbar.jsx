import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCategories } from "../services/categoryService";

export default function Navbar({ user, role, setUser }) {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [showManage, setShowManage] = useState(false);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editCategoryName, setEditCategoryName] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Error loading categories", error);
        }
    };

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

    const apiUrl = "http://localhost:5038/api/Categories";

    const addCategory = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("No access token found, please login again.");
            return;
        }
        if (!newCategoryName.trim()) {
            alert("Category name required");
            return;
        }
        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });
            if (!res.ok) throw new Error("Failed to add category");
            setNewCategoryName("");
            loadCategories();
        } catch (error) {
            alert("Error adding category: " + error.message);
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setEditCategoryName(category.name);
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setEditCategoryName("");
    };

    const saveEdit = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("No access token found, please login again.");
            return;
        }
        if (!editCategoryName.trim()) {
            alert("Category name required");
            return;
        }
        try {
            const res = await fetch(`${apiUrl}/${editingCategory.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: editingCategory.id, name: editCategoryName.trim() })
            });
            if (!res.ok) throw new Error("Failed to update category");
            setEditingCategory(null);
            setEditCategoryName("");
            loadCategories();
        } catch (error) {
            alert("Error updating category: " + error.message);
        }
    };

    const deleteCategory = async (id) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("No access token found, please login again.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this category?")) return;
        try {
            const res = await fetch(`${apiUrl}/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to delete category");
            loadCategories();
        } catch (error) {
            alert("Error deleting category: " + error.message);
        }
    };

    if (!user) return null;

    return (
        <>
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

                    {role === "admin" && (
                        <button
                            onClick={() => setShowManage(true)}
                            className="bg-green-500 px-3 py-1 rounded hover:bg-green-700"
                        >
                            Manage Categories
                        </button>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 px-3 py-1 rounded hover:bg-red-700"
                >
                    Logout
                </button>
            </nav>

            {showManage && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Manage Categories</h2>

                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="New category name"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="border p-2 mr-2 w-full"
                            />
                            <button
                                onClick={addCategory}
                                className="bg-blue-600 text-white px-3 py-1 rounded mt-2 w-full"
                            >
                                Add Category
                            </button>
                        </div>

                        <ul>
                            {categories.map((cat) => (
                                <li key={cat.id} className="flex justify-between items-center mb-2">
                                    {editingCategory && editingCategory.id === cat.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editCategoryName}
                                                onChange={(e) => setEditCategoryName(e.target.value)}
                                                className="border p-1 flex-grow mr-2"
                                            />
                                            <button
                                                onClick={saveEdit}
                                                className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                className="bg-gray-400 text-white px-2 py-1 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <span>{cat.name}</span>
                                            <div>
                                                <button
                                                    onClick={() => startEdit(cat)}
                                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-1"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteCategory(cat.id)}
                                                    className="bg-red-600 text-white px-2 py-1 rounded"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => setShowManage(false)}
                            className="mt-4 bg-gray-600 text-white px-4 py-2 rounded w-full"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
