const API_URL = 'http://localhost:5038/api/roles';

const getRoles = async () => {
    const response = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
    return await response.json();
};

const addRole = async (name) => {
    await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ name }),
    });
};

const deleteRole = async (id) => {
    await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    });
};

export default { getRoles, addRole, deleteRole };