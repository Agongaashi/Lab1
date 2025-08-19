import { useEffect, useState } from "react";
import { getProducts, addProduct, deleteProduct, updateProduct } from "../services/productService";
import { getCategories } from "../services/categoryService";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", categoryId: "", imageFile: null });
    const [editingProductId, setEditingProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Load products
    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch {
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    // Load categories
    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories();
            setCategories(data);
        } catch {
            setError("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
        loadCategories();
    }, []);

    // Add / Update
    const handleAddOrUpdate = async (e) => {
        e.preventDefault();
        setError("");

        if (!form.name.trim()) return setError("Product name is required.");
        if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0)
            return setError("Price must be a positive number.");
        if (!form.categoryId || isNaN(parseInt(form.categoryId)))
            return setError("Category must be selected.");

        try {
            setLoading(true);

            const productData = {
                name: form.name.trim(),
                price: parseFloat(form.price),
                categoryId: parseInt(form.categoryId),
                imageFile: form.imageFile
            };

            if (editingProductId) {
                await updateProduct(editingProductId, productData);
                setEditingProductId(null);
            } else {
                await addProduct(productData);
            }

            setForm({ name: "", price: "", categoryId: "", imageFile: null });
            await loadProducts();
        } catch (err) {
            setError("Failed to save product. " + (err.response?.data || err.message));
        } finally {
            setLoading(false);
        }
    };

    // Edit
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            categoryId: product.categoryId || "",
            imageFile: null
        });
        setEditingProductId(product.id);
    };

    // Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            setLoading(true);
            await deleteProduct(id);
            await loadProducts();
        } catch {
            setError("Failed to delete product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Manage Products</h1>

            {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}

            <form onSubmit={handleAddOrUpdate} className="flex gap-3 mb-6 flex-wrap" encType="multipart/form-data">
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
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.gif"
                    onChange={(e) => setForm({ ...form, imageFile: e.target.files[0] })}
                    className="border p-2 rounded flex-grow min-w-[150px]"
                    disabled={loading}
                />

                <button type="submit" className="bg-green-500 text-white px-4 rounded disabled:opacity-50" disabled={loading}>
                    {editingProductId ? "Update Product" : "Add Product"}
                </button>

                {editingProductId && (
                    <button
                        type="button"
                        onClick={() => { setForm({ name: "", price: "", categoryId: "", imageFile: null }); setEditingProductId(null); }}
                        className="bg-gray-500 text-white px-4 rounded"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                )}
            </form>

            <ul>
                {products.map((p) => (
                    <li key={p.id} className="flex justify-between items-center border p-3 rounded mb-2">
                        <span className="flex items-center gap-3">
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl}
                                    alt={p.name}
                                    className="h-12 w-12 object-cover rounded"
                                    onError={(e) => { e.currentTarget.src = "/images/default.png"; }}
                                />
                            ) : (
                                <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                    No Image
                                </div>
                            )}
                            {p.name} - €{p.price.toFixed(2)} ({p.category?.name || "No Category"})
                        </span>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                            <button onClick={() => handleDelete(p.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
