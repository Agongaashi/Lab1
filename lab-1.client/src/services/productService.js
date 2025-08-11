import axios from "axios";

const API_URL = "http://localhost:5038/api/products";

export const getProducts = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const addProduct = async (product) => {
    const token = localStorage.getItem("accessToken");
    const response = await axios.post(API_URL, product, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.data;
};

export const deleteProduct = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`${API_URL}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
