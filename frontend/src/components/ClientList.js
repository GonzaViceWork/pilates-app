import React, { useState, useEffect } from 'react';
import api from '../services/api';

const ClientList = () => {
    const [clients, setClients] = useState([]);

    useEffect(() => {
        api.get('clients/')
            .then((response) => {
                setClients(response.data);
            })
            .catch((error) => {
                console.error('Error al obtener los clientes:', error);
            });
    }, []);

    return (
        <div>
            <h1>Lista de Clientes</h1>
            <ul>
                {clients.map((client) => (
                    <li key={client.id}>
                        {client.name} - {client.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ClientList;