import axios from 'axios';

const API = 'http://localhost:5038/api/Auth';

// Login: ruan accessToken dhe refreshToken në localStorage
export const login = async (data) => {
    const res = await axios.post(`${API}/login`, data);
    const tokens = res.data?.data;

    if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error('Tokens not received from login');
    }

    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
};

// Register: dërgon të dhënat për regjistrim, nuk ruan token
export const register = async (data) => {
    const res = await axios.post(`${API}/register`, data);
    return res.data;
};

// Refresh: merr tokenë të rinj duke përdorur refreshToken
export const refresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('Refresh token not found');

    const res = await axios.post(`${API}/refresh`, { refreshToken });
    const tokens = res.data?.data;

    if (!tokens?.accessToken || !tokens?.refreshToken) {
        throw new Error('Tokens not received from refresh');
    }

    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);

    return tokens;
};

// Logout: fshin tokenët nga localStorage dhe njofton backend për logout
export const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
        try {
            await axios.post(`${API}/logout`, { refreshToken });
        } catch (error) {
            console.warn('Logout request failed:', error.message);
        }
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};

// Merr të dhënat e user-it nga JWT access token
export function getUserFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const base64Payload = token.split('.')[1];
        const jsonPayload = decodeURIComponent(
            atob(base64Payload)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Invalid token format:', error);
        return null;
    }
}
