import axios from "axios";

const API_URL = "http://localhost:5038/api/products";

// Get all products
export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

// Add new product
export const addProduct = async (product) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("Price", product.price);
    formData.append("CategoryId", product.categoryId);

    if (product.imageFile) {
        formData.append("Image", product.imageFile);
    }

    const response = await axios.post(API_URL, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            // 👇 Mos e cakto manualisht multipart, leje axios ta bëjë vetë
        },
    });

    return response.data;
};

// Update product
export const updateProduct = async (id, product) => {
    const token = localStorage.getItem("accessToken");

    const formData = new FormData();
    formData.append("Name", product.name);
    formData.append("Price", product.price);
    formData.append("CategoryId", product.categoryId);

    if (product.imageFile) {
        formData.append("Image", product.imageFile);
    }

    const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
