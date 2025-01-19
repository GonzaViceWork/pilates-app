import React, { useState } from 'react';
import api from '../api/axios';

const SessionPackForm = ({ clientId, onSave }) => {
    const [sessionsAdded, setSessionsAdded] = useState(0);
    const [sessionsDeducted, setSessionsDeducted] = useState(0);
    const [note, setNote] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const sessionPackData = {
            client: clientId,
            sessions_added: sessionsAdded,
            sessions_deducted: sessionsDeducted,
            note,
        };

        try {
            await api.post('/session_packs/', sessionPackData);
            onSave();
        } catch (error) {
            console.error('Error managing session packs:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Gestionar Packs de Sesiones</h2>
            <div>
                <label>Sesiones Agregadas:</label>
                <input
                    type="number"
                    value={sessionsAdded}
                    onChange={(e) => setSessionsAdded(e.target.value)}
                    min="0"
                />
            </div>
            <div>
                <label>Sesiones Descontadas:</label>
                <input
                    type="number"
                    value={sessionsDeducted}
                    onChange={(e) => setSessionsDeducted(e.target.value)}
                    min="0"
                />
            </div>
            <div>
                <label>Nota:</label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
};

export default SessionPackForm;
