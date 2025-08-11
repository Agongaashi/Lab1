import { useEffect, useState } from "react";
import { getOrdersByUser, deleteOrder } from "../services/orderService";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const data = await getOrdersByUser();
            setOrders(data);
        } catch (error) {
            console.error("Gabim gjat� marrjes s� porosive:", error);
        }
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm("A jeni t� sigurt q� d�shironi t� anuloni k�t� porosi?"))
            return;
        try {
            await deleteOrder(orderId);
            loadOrders();
        } catch (error) {
            console.error("Gabim gjat� fshirjes s� porosis�:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Porosit� e Mia</h1>
            {orders.length === 0 ? (
                <p>Ende nuk keni b�r� asnj� porosi.</p>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="border p-4 mb-3 rounded">
                        <p>
                            <strong>Porosia #{order.id}</strong> -{" "}
                            {new Date(order.orderDate).toLocaleDateString("sq-AL")}
                        </p>
                        <p>
                            <strong>Adres� Transporti:</strong> {order.shippingStreet},{" "}
                            {order.shippingCity}
                        </p>
                        <p>
                            <strong>Totali:</strong> �{order.totalPrice.toFixed(2)}
                        </p>

                        <p className="mt-2 font-semibold">Produktet:</p>
                        <ul className="list-disc list-inside">
                            {order.products?.map((p, index) => (
                                <li key={index}>
                                    {p.productName} &mdash; Sasi: {p.quantity} &mdash; �mimi nj�si: �{p.unitPrice.toFixed(2)} &mdash; Subtotali: �{(p.unitPrice * p.quantity).toFixed(2)}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Anulo Porosin�
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
