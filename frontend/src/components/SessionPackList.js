import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const SessionPackList = ({ clientId }) => {
    const [packs, setPacks] = useState([]);

    useEffect(() => {
        fetchSessionPacks();
    }, []);

    const fetchSessionPacks = async () => {
        try {
            const response = await api.get(`/session_packs/?client=${clientId}`);
            setPacks(response.data);
        } catch (error) {
            console.error('Error fetching session packs:', error);
        }
    };

    return (
        <div>
            <h2>Packs de Sesiones</h2>
            <ul>
                {packs.map((pack) => (
                    <li key={pack.id}>
                        {pack.sessions_added > 0 && `+${pack.sessions_added} sesiones`}
                        {pack.sessions_deducted > 0 && ` -${pack.sessions_deducted} sesiones`} 
                        (Nota: {pack.note || 'Sin nota'})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SessionPackList;
