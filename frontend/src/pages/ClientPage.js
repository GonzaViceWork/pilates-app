import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const ClientPage = ({ clientId }) => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        fetchClient();
    }, []);

    const fetchClient = async () => {
        try {
            const response = await api.get(`/clients/${clientId}/`);
            setClient(response.data);
        } catch (error) {
            console.error('Error fetching client:', error);
        }
    };

    if (!client) {
        return <div>Cargando cliente...</div>;
    }

    return (
        <div>
            <h2>
                {client.first_name} {client.last_name}
            </h2>
            <p>Email: {client.email}</p>
            <p>Teléfono: {client.phone}</p>
            <p>Cupos disponibles: {client.available_credits}</p>
            <h3>Historial de Créditos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Acción</th>
                        <th>Cupos</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {client.credit_logs.map((log) => (
                        <tr key={log.date}>
                            <td>{log.action}</td>
                            <td>{log.slots}</td>
                            <td>{log.description}</td>
                            <td>{new Date(log.date).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientPage;
