import React, { useEffect, useState } from 'react';
import roleService from './roleService';
import RoleSelector from '../components/RoleSelector';

export default function AdminRolesPage() {
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        const result = await roleService.getRoles();
        setRoles(result);
    };

    const handleAddRole = async (roleName) => {
        await roleService.addRole(roleName);
        loadRoles();
    };

    const handleDeleteRole = async (roleId) => {
        await roleService.deleteRole(roleId);
        loadRoles();
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Menaxho Rolet</h1>
            <RoleSelector onAddRole={handleAddRole} />
            <ul className="mt-4">
                {roles.map((role) => (
                    <li key={role.id} className="flex justify-between items-center border p-2">
                        {role.name}
                        <button className="text-red-500" onClick={() => handleDeleteRole(role.id)}>Fshij</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}