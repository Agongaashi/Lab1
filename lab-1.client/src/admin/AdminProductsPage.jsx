/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", categoryId: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        setError("");

        // Basic validation
        if (!form.name.trim()) {
            setError("Product name is required.");
            return;
        }
        if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
            setError("Price must be a positive number.");
            return;
        }
        if (!form.categoryId || isNaN(parseInt(form.categoryId))) {
            setError("Category must be selected.");
            return;
        }

        try {
            setLoading(true);
            const newProduct = {
                name: form.name.trim(),
                price: parseFloat(form.price),
                categoryId: parseInt(form.categoryId),
            };
            await addProduct(newProduct);
            setForm({ name: "", price: "", categoryId: "" });
            await loadProducts();
        } catch (err) {
            setError("Failed to add product. " + (err.message || ""));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        setError("");
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            setLoading(true);
            await deleteProduct(id);
            await loadProducts();
        } catch (err) {
            setError("Failed to delete product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Manage Products</h1>

            {error && (
                <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>
            )}

            <form onSubmit={handleAdd} className="flex gap-3 mb-6 flex-wrap">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 rounded flex-grow min-w-[150px]"
                    disabled={loading}
                />
                <input
                    type="number"
                    placeholder="Price"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 rounded w-[120px]"
                    disabled={loading}
                    min="0"
                    step="0.01"
                />
                <select
                    value={form.categoryId}
                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                    className="border p-2 rounded w-[180px]"
                    disabled={loading}
                >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Add Product"}
                </button>
            </form>

            {loading && !products.length ? (
                <p>Loading products...</p>
            ) : (
                <ul>
                    {products.map((p) => (
                        <li
                            key={p.id}
                            className="flex justify-between items-center border p-3 rounded mb-2"
                        >
                            <span>
                                {p.name} - €{p.price.toFixed(2)} ({p.category?.name || "No Category"})
                            </span>
                            <button
                                onClick={() => handleDelete(p.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
