import jwtDecode from 'jwt-decode';

export function getUserFromToken() {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    return jwtDecode(token);
}
