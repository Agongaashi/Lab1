import React, { useEffect, useState } from 'react';
import * as roleService from './roleService';

export default function AdminRolesPage() {
    const [roles, setRoles] = useState([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const data = await roleService.getRoles();
            setRoles(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Gabim në marrjen e roleve');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleAddRole = async () => {
        if (!newRoleName.trim()) return;

        try {
            setLoading(true);
            await roleService.addRole(newRoleName.trim());
            setNewRoleName('');
            fetchRoles();
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Gabim në shtimin e rolit');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = async (roleId) => {
        try {
            setLoading(true);
            await roleService.deleteRole(roleId);
            fetchRoles();
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Gabim në fshirjen e rolit');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Menaxhimi i Roleve</h1>

            {error && <div className="mb-2 text-red-600">{error}</div>}

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Emri i rolit të ri"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    className="border px-2 py-1 mr-2"
                    disabled={loading}
                />
                <button onClick={handleAddRole} disabled={loading || !newRoleName.trim()} className="bg-blue-600 text-white px-3 py-1 rounded">
                    Shto
                </button>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : (
                <ul className="list-disc pl-5">
                    {roles.length === 0 && <li>Nuk ka role të regjistruara.</li>}
                    {roles.map((role) => (
                        <li key={role.id} className="flex justify-between items-center mb-1">
                            <span>{role.name}</span>
                            <button
                                onClick={() => handleDeleteRole(role.id)}
                                className="text-red-600 hover:underline"
                                disabled={loading}
                            >
                                Fshi
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
