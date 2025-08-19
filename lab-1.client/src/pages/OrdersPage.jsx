import { useEffect, useState } from "react";
import { getOrdersByUser, deleteOrder } from "../services/orderService";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        setLoading(true);
        getOrdersByUser()
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Gabim gjatë marrjes së porosive:", err);
                setError("Nuk mund të marrim porositë.");
                setLoading(false);
            });
    };

    const handleDelete = (orderId) => {
        if (!window.confirm("A jeni të sigurt që dëshironi të anuloni këtë porosi?")) return;

        deleteOrder(orderId)
            .then(() => fetchOrders())
            .catch((err) => {
                console.error("Gabim gjatë fshirjes së porosisë:", err);
                alert("Gabim gjatë fshirjes së porosisë. Kontrollo token-in tuaj.");
            });
    };

    if (loading) return <p>Duke ngarkuar...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Porositë e Mia</h1>

            {orders.length === 0 ? (
                <p>Nuk ka porosi.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order?.orderId} className="border rounded shadow p-4">
                            {/* Info e porosisë */}
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="font-bold text-lg">Porosia # {order?.orderId || "-"}</p>
                                    <p>Përdoruesi: {order?.userName || "-"}</p>
                                    <p>
                                        Adresë: {order?.shippingStreet || "-"}, {order?.shippingCity || "-"},{" "}
                                        {order?.shippingCountry || "-"} - {order?.shippingPostalCode || "-"}
                                    </p>
                                    <p>Totali: €{order?.totalPrice?.toFixed(2) || "0.00"}</p>
                                </div>
                                <button
                                    onClick={() => handleDelete(order?.orderId)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                                >
                                    Anulo
                                </button>
                            </div>

                            {/* Lista e produkteve me imazhe */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                {Array.isArray(order?.products) && order.products.length > 0 ? (
                                    order.products.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-gray-50 p-3 rounded flex flex-col items-center shadow hover:shadow-lg transition"
                                        >
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl || "/images/default.png"}
                                                    alt={item.name || "Produkt"}
                                                    className="h-28 w-28 object-cover rounded mb-2"
                                                    onError={(e) => {
                                                        if (e.currentTarget.src !== window.location.origin + "/images/default.png") {
                                                            e.currentTarget.src = "/images/default.png";
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="h-28 w-28 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs mb-2">
                                                    No Image
                                                </div>
                                            )}


                                            <p className="font-bold text-center">{item.name}</p>
                                            <p className="text-sm text-gray-600">€{item.unitPrice.toFixed(2)}</p>
                                            <p className="text-sm text-gray-500">Sasia: {item.quantity}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm">Ky porosi nuk ka produkte.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
