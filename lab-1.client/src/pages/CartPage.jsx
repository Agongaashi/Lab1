import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart } from "../services/cartService";
import { createOrder } from "../services/orderService";

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [shippingAddress, setShippingAddress] = useState(null);

    useEffect(() => {
        setCart(getCart());
        const address = JSON.parse(localStorage.getItem("shippingAddress"));
        setShippingAddress(address);
    }, []);

    const handleRemoveFromCart = (index) => {
        removeFromCart(index);
        setCart(getCart());
    };

    const handlePlaceOrder = async () => {
        try {
            if (cart.length === 0) {
                alert("Karroca është bosh!");
                return;
            }

            if (
                !shippingAddress?.street ||
                !shippingAddress?.city ||
                !shippingAddress?.country ||
                !shippingAddress?.postalCode
            ) {
                alert("Ju lutem vendosni një adresë të plotë të transportit.");
                return;
            }

            if (cart.some(item => !item.id || !item.price || !item.quantity)) {
                alert("Në karrocë ka produkte me të dhëna të paplota.");
                return;
            }

            const totalPrice = cart.reduce(
                (sum, item) => sum + item.price * (item.quantity || 1),
                0
            );

            // ✅ Përputhet me backend (pa ID, vetëm të dhënat e adresës)
            const orderData = {
                shippingAddress: {
                    street: shippingAddress.street,
                    city: shippingAddress.city,
                    country: shippingAddress.country,
                    postalCode: shippingAddress.postalCode,
                },
                totalPrice,
                items: cart.map(item => ({
                    productId: item.id,
                    quantity: item.quantity || 1,
                    unitPrice: item.price,
                    imageUrl: item.imageUrl || "",
                    name: item.name
                })),
            };

            await createOrder(orderData);

            alert("Porosia u vendos me sukses!");
            clearCart();
            localStorage.removeItem("shippingAddress");
            setCart([]);
            setShippingAddress(null);
        } catch (error) {
            console.error("Gabim gjatë vendosjes së porosisë:", error);
            if (error.message.includes("401")) {
                alert("Ju nuk jeni i autorizuar. Ju lutem logohuni përsëri.");
            } else {
                alert(error.message || "Gabim gjatë vendosjes së porosisë!");
            }
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Karroca</h1>

            {cart.length === 0 ? (
                <p>Karroca është bosh.</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cart.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white shadow p-4 rounded flex justify-between items-center gap-4"
                            >
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="h-20 w-20 object-cover rounded"
                                        onError={(e) => { e.currentTarget.src = "/images/default.png"; }}
                                    />
                                ) : (
                                    <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                        No Image
                                    </div>
                                )}

                                <div className="flex-1">
                                    <h2 className="font-bold">{item.name}</h2>
                                    <p>€{item.price.toFixed(2)}</p>
                                    {shippingAddress && (
                                        <p className="text-sm text-gray-500">
                                            Adresë: {shippingAddress.street}, {shippingAddress.city},{" "}
                                            {shippingAddress.country} - {shippingAddress.postalCode}
                                        </p>
                                    )}
                                    <p>Sasia: {item.quantity}</p>
                                </div>

                                <button
                                    onClick={() => handleRemoveFromCart(index)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Hiq
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                        Vendos Porosinë
                    </button>
                </>
            )}
        </div>
    );
}
