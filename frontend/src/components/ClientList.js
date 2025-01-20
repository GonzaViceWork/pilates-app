import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ClientList = ({ onEdit, onSelect }) => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get('/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const deleteClient = async (id) => {
        try {
            await api.delete(`/clients/${id}/`);
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
        }
    };

    return (
        <div>
            <h2>Clientes</h2>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>
                        {client.first_name} {client.last_name} - {client.email} - Slots: {client.available_slots} 
                        <button onClick={() => onEdit(client)}>Editar</button>
                        <button onClick={() => onSelect(client)}>Seleccionar</button>
                        <button onClick={() => deleteClient(client.id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientList;
