import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import { addToCart } from "../services/cartService";

export default function ShopPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get("categoryId");

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [address, setAddress] = useState({
        street: "",
        city: "",
        country: "",
        postalCode: "",
    });

    // Ngarkon produktet nga backend (me ImageUrl)
    useEffect(() => {
        const loadProducts = async () => {
            setError("");
            try {
                setLoading(true);
                let data = await getProducts(); // merr të gjitha produktet nga backend
                if (categoryId) data = data.filter((p) => p.categoryId === parseInt(categoryId));
                setProducts(data);
            } catch {
                setError("Gabim gjatë ngarkimit të produkteve.");
            } finally {
                setLoading(false);
            }
        };
        loadProducts();
    }, [categoryId]);

    const handleAddToCart = (product) => {
        setSelectedProduct(product);
        setShowAddressForm(true);
    };

    const handleSubmitAddress = (e) => {
        e.preventDefault();
        if (!address.street || !address.city || !address.country || !address.postalCode) {
            alert("Plotëso të gjitha fushat e adresës!");
            return;
        }

        localStorage.setItem("shippingAddress", JSON.stringify(address));
        addToCart(selectedProduct);

        setAddress({ street: "", city: "", country: "", postalCode: "" });
        setShowAddressForm(false);
        alert(`${selectedProduct.name} u shtua në karrocë!`);
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">
                {categoryId ? `Produktet në Kategorinë #${categoryId}` : "Të Gjitha Produktet"}
            </h1>

            {error && <div className="bg-red-200 text-red-700 p-2 mb-4 rounded">{error}</div>}

            {loading ? (
                <p>Duke ngarkuar produktet...</p>
            ) : products.length === 0 ? (
                <p>Nuk u gjetën produkte.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <div key={p.id} className="bg-white shadow-md p-4 rounded flex flex-col justify-between">
                            {/* Imazhi */}
                            {p.imageUrl ? (
                                <img
                                    src={p.imageUrl} // përdor ImageUrl nga backend
                                    alt={p.name}
                                    className="mb-2 h-40 object-cover rounded"
                                    onError={(e) => { e.currentTarget.src = "/images/default.png"; }} // fallback
                                />
                            ) : (
                                <div className="h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs mb-2">
                                    No Image
                                </div>
                            )}

                            {/* Emri dhe çmimi */}
                            <h2 className="text-lg font-bold">{p.name}</h2>
                            <p className="text-gray-600 mb-4">€{parseFloat(p.price).toFixed(2)}</p>

                            {/* Kategoria */}
                            <p className="text-gray-500 mb-4 text-sm">
                                {p.category?.name || "Pa Kategori"}
                            </p>

                            {/* Shto në karrocë */}
                            <button
                                onClick={() => handleAddToCart(p)}
                                className="mt-auto px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                            >
                                Shto në Karrocë
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Forma e adresës */}
            {showAddressForm && (
                <form onSubmit={handleSubmitAddress} className="bg-gray-100 p-4 rounded mt-6 max-w-md">
                    <h2 className="text-xl font-bold mb-3">Vendos Adresën e Transportit</h2>
                    <input
                        type="text"
                        placeholder="Rruga"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="border px-3 py-1 rounded w-full mb-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Qyteti"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="border px-3 py-1 rounded w-full mb-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Shteti"
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        className="border px-3 py-1 rounded w-full mb-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Kodi Postar"
                        value={address.postalCode}
                        onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                        className="border px-3 py-1 rounded w-full mb-2"
                        required
                    />
                    <button type="submit" className="bg-green-500 text-white px-4 py-1 rounded">
                        Konfirmo Adresën dhe Shto në Karrocë
                    </button>
                </form>
            )}
        </div>
    );
}
