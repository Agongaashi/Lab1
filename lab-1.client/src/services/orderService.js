export async function createOrder(orderData) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:5038/api/Orders", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error("Gabim gjat� krijimit t� porosis�: " + errorText);
    }

    return await res.json();
}

export async function getOrdersByUser() {
    const token = localStorage.getItem("accessToken");
    const res = await fetch("http://localhost:5038/api/Orders", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Gabim gjat� marrjes s� porosive.");
    }

    return await res.json();
}

export async function deleteOrder(orderId) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`http://localhost:5038/api/Orders/${orderId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error("Gabim gjat� fshirjes s� porosis�.");
    }
}
