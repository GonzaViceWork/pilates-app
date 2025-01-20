import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const SessionForm = ({ onSave }) => {
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [date, setDate] = useState('');
    const [sessionType, setSessionType] = useState('private');

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sessionData = {
            date,
            session_type: sessionType,
            clients: selectedClients,
        };

        try {
            await api.post('/sessions/', sessionData);
            onSave();
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Nueva Clase</h2>
            <div>
                <label>Fecha y Hora:</label>
                <input
                    type="datetime-local"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div>
                <label>Tipo de Clase:</label>
                <select value={sessionType} onChange={(e) => setSessionType(e.target.value)}>
                    <option value="private">Privada</option>
                    <option value="group">Grupal</option>
                </select>
            </div>
            <div>
                <label>Seleccionar Clientes:</label>
                <select
                    multiple
                    value={selectedClients}
                    onChange={(e) =>
                        setSelectedClients([...e.target.selectedOptions].map((opt) => opt.value))
                    }
                >
                    {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                            {client.name}
                        </option>
                    ))}
                </select>
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default SessionForm;
