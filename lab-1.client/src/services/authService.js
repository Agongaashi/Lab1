import axios from 'axios';

const API = 'http://localhost:5038/api/Auth';

// Login: Dërgon email dhe password, ruan accessToken në localStorage
export const login = async (data) => {
    const res = await axios.post(`${API}/login`, data);

    // Ruaj accessToken në localStorage
    const token = res.data?.data?.accessToken;
    if (token) {
        localStorage.setItem('accessToken', token);
    }

    return res.data;
};

// Register: Dërgon username, email, password, roleId
// Nuk ruan accessToken, vetëm e kthen përgjigjen
export const register = async (data) => {
    const res = await axios.post(`${API}/register`, data);
    return res.data;
};

// Logout: Thjesht fshin tokenin nga localStorage
export const logout = () => {
    localStorage.removeItem('accessToken');
};
