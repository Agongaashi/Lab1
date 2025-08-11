import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "../services/cartService";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setCart(getCart());
    }, []);

    const handleRemove = (index) => {
        removeFromCart(index);
        setCart(getCart());
    };

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            alert("Karroca �sht� bosh!");
            return;
        }

        const shippingAddress = cart[0].shippingAddress;
        if (
            !shippingAddress ||
            !shippingAddress.street ||
            !shippingAddress.city ||
            !shippingAddress.country ||
            !shippingAddress.postalCode
        ) {
            alert("Adresat e transportit mungojn� ose nuk jan� plot�suar sakt�!");
            return;
        }

        try {
            const token = localStorage.getItem("accessToken");

            // 1. Krijo adres�n e transportit n� backend
            const addressResponse = await fetch("http://localhost:5038/api/ShippingAddresses", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(shippingAddress),
            });

            if (!addressResponse.ok) throw new Error("Gabim gjat� krijimit t� adres�s");
            const createdAddress = await addressResponse.json();

            // 2. P�rgatit t� dh�nat e porosis� sipas backend-it
            const order = {
                items: cart.map((c) => ({
                    productId: c.id,
                    quantity: c.quantity,
                    unitPrice: c.price, // *Kujdes: emri duhet 'unitPrice'*
                })),
                shippingAddressId: createdAddress.id,
                totalPrice: cart.reduce((sum, c) => sum + c.price * c.quantity, 0),
            };

            // 3. Krijo porosin� n� backend
            await createOrder(order);

            // 4. Pas suksesit, pastro karroc�n dhe shfaq mesazh
            clearCart();
            alert("Porosia u vendos me sukses!");
            navigate("/orders");
        } catch (error) {
            console.error("Gabim gjat� realizimit t� porosis�:", error);
            alert("Gabim gjat� realizimit t� porosis�.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Karroca Juaj</h1>
            {cart.length === 0 ? (
                <p>Karroca �sht� bosh.</p>
            ) : (
                <>
                    <ul>
                        {cart.map((c, index) => (
                            <li
                                key={index}
                                className="flex flex-col bg-gray-100 p-3 mb-2 rounded"
                            >
                                <div className="flex justify-between items-center">
                                    <span>
                                        {c.name} x {c.quantity} - �{(c.price * c.quantity).toFixed(2)}
                                    </span>
                                    <button
                                        onClick={() => handleRemove(index)}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        Hiq
                                    </button>
                                </div>
                                <div className="text-sm text-gray-600 mt-2">
                                    <strong>Adres�:</strong> {c.shippingAddress.street},{" "}
                                    {c.shippingAddress.city}, {c.shippingAddress.country} -{" "}
                                    {c.shippingAddress.postalCode}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={handlePlaceOrder}
                        className="mt-4 bg-green-500 px-4 py-2 rounded text-white"
                    >
                        Vendos Porosin�
                    </button>
                </>
            )}
        </div>
    );
}
