import axios from 'axios';

const API = 'http://localhost:5038/api/Auth';

// Login: D�rgon email dhe password, ruan accessToken n� localStorage
export const login = async (data) => {
    const res = await axios.post(`${API}/login`, data);

    // Ruaj accessToken n� localStorage
    const token = res.data?.data?.accessToken;
    if (token) {
        localStorage.setItem('accessToken', token);
    }

    return res.data;
};

// Register: D�rgon username, email, password, roleId
// Nuk ruan accessToken, vet�m e kthen p�rgjigjen
export const register = async (data) => {
    const res = await axios.post(`${API}/register`, data);
    return res.data;
};

// Logout: Thjesht fshin tokenin nga localStorage
export const logout = () => {
    localStorage.removeItem('accessToken');
};
