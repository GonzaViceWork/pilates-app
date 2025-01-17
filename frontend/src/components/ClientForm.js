import React, { useState } from 'react';
import api from '../api/axios';

const ClientForm = ({ client, onSave }) => {
    const [name, setName] = useState(client ? client.name : '');
    const [email, setEmail] = useState(client ? client.email : '');
    const [phone, setPhone] = useState(client ? client.phone : '');
    const [totalSessions, setTotalSessions] = useState(client ? client.total_sessions : 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientData = { name, email, phone, total_sessions: totalSessions };

        try {
            if (client) {
                // Actualizar cliente
                await api.put(`/clients/${client.id}/`, clientData);
            } else {
                // Crear cliente
                await api.post('/clients/', clientData);
            }
            onSave();
        } catch (error) {
            console.error('Error saving client:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{client ? 'Editar Cliente' : 'Crear Cliente'}</h2>
            <div>
                <label>Nombre:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label>Teléfono:</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
                <label>Total de sesiones:</label>
                <input type="number" value={totalSessions} onChange={(e) => setTotalSessions(e.target.value)} min="0" />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default ClientForm;
