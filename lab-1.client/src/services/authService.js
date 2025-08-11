// services/authService.js
import axios from 'axios';

const API = 'http://localhost:5038/api/Auth'; // API backend-it

// Login: thërret API, ruan accessToken dhe refreshToken në localStorage
export async function login({ email, password }) {
    const res = await axios.post(`${API}/login`, { email, password });
    const tokens = res.data?.data;

    if (tokens?.accessToken && tokens?.refreshToken) {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
    } else {
        throw new Error('No tokens received');
    }
}

// Register: thërret API për regjistrim useri të ri
export async function register({ username, email, password, roleName }) {
    const res = await axios.post(`${API}/register`, {
        username,
        email,
        password,
        roleName,
    }, {
        headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
}

// Nxjerr user-in nga token JWT (dekodim i payload)
export function getUserFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        const user = JSON.parse(jsonPayload);

        // Log për debug
        console.log("Decoded token payload:", user);

        return user;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

// Merr rolin e user-it nga token-i, pavarësisht se si quhet claim-i
export function getUserRole() {
    const user = getUserFromToken();
    if (!user) return null;

    // Lista e mundshme e çelësave për rolin
    const roleKeys = [
        "role",
        "roles",
        "Role",
        "Roles",
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ];

    for (const key of roleKeys) {
        if (user[key]) {
            return Array.isArray(user[key])
                ? user[key][0].toLowerCase() // nëse ka disa role, merr të parin
                : user[key].toLowerCase();
        }
    }

    return null;
}

// Logout: heq token-at nga localStorage
export function logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}
