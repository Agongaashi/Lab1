import React, { useState } from 'react';

export default function RoleSelector({ onAddRole }) {
    const [roleName, setRoleName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddRole(roleName);
        setRoleName('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                placeholder="Emri i rolit"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                className="border p-1"
            />
            <button type="submit" className="bg-green-500 text-white px-3 py-1">Shto</button>
        </form>
    );
}