import React, { useState } from 'react';
import api from '../api/axios';

const ClientForm = ({ client, onSave }) => {
    const [first_name, setFirstName] = useState(client ? client.first_name : '');
    const [last_name, setLastName] = useState(client ? client.last_name : '');
    const [email, setEmail] = useState(client ? client.email : '');
    const [phone, setPhone] = useState(client ? client.phone : '');
    const [availableSlots, setAvailableSlots] = useState(client ? client.available_slots : 0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const clientData = { first_name, last_name, email, phone, available_slots: availableSlots };

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
                <input type="text" value={first_name} onChange={(e) => setFirstName(e.target.value)} required />
            </div>
            <div>
                <label>Apellido:</label>
                <input type="text" value={last_name} onChange={(e) => setLastName(e.target.value)} required />
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
                <input type="number" value={availableSlots} onChange={(e) => setAvailableSlots(e.target.value)} min="0" />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default ClientForm;
