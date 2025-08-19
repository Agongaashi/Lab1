const API_URL = "http://localhost:5038/api/orders";

function getAuthToken() {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("Nuk je i loguar. Ju lutem identifikohuni.");
    return token;
}

// ✅ Krijon një porosi të re
export async function createOrder(orderData) {
    const token = getAuthToken();

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ POST /orders Status: ${res.status}`, errorText);
            if (res.status === 401) throw new Error("401 Unauthorized: Ju nuk jeni i autorizuar.");
            throw new Error(errorText || "Gabim gjatë krijimit të porosisë.");
        }

        const data = await res.json();
        console.log("✅ Porosia u krijua:", data);
        return data;
    } catch (err) {
        console.error("⚠️ createOrder error:", err.message);
        throw err;
    }
}

// ✅ Merr të gjitha porositë e përdoruesit aktual
export async function getOrdersByUser() {
    const token = getAuthToken();

    try {
        const res = await fetch(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ GET /orders Status: ${res.status}`, errorText);
            if (res.status === 401) throw new Error("401 Unauthorized: Ju nuk jeni i autorizuar.");
            throw new Error(errorText || "Gabim gjatë marrjes së porosive.");
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("⚠️ getOrdersByUser error:", err.message);
        throw err;
    }
}

// ✅ Fshin një porosi sipas ID-së
export async function deleteOrder(orderId) {
    const token = getAuthToken();

    try {
        const res = await fetch(`${API_URL}/${orderId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error(`❌ DELETE /orders/${orderId} Status: ${res.status}`, errorText);
            if (res.status === 401) throw new Error("401 Unauthorized: Ju nuk jeni i autorizuar.");
            throw new Error(errorText || "Gabim gjatë fshirjes së porosisë.");
        }

        console.log(`✅ Porosia ${orderId} u fshi me sukses`);
        return true;
    } catch (err) {
        console.error("⚠️ deleteOrder error:", err.message);
        throw err;
    }
}
