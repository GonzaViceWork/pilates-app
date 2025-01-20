import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ClientDetailPage = () => {
    const { client_id } = useParams();
    const [client, setClient] = useState(null);
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        fetchClient();
        fetchSessions();
    }, []);

    const fetchClient = async () => {
        try {
            const response = await api.get(`/clients/${client_id}/`);
            setClient(response.data);
        } catch (error) {
            console.error("Error al obtener el cliente:", error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await api.get(`/sessions/?client_id=${client_id}`);
            setSessions(response.data);
        } catch (error) {
            console.error("Error al obtener las sesiones:", error);
        }
    };

    const handleAssignSession = async (sessionId) => {
        try {
            await api.post(`/sessions/${sessionId}/assign/`, { client_id });
            fetchSessions();
        } catch (error) {
            console.error("Error al asignar sesión:", error);
        }
    };

    if (!client) {
        return <div>Cargando cliente...</div>;
    }

    return (
        <div>
            {/* Información del cliente */}
            <h1>
                {client.first_name} {client.last_name}
            </h1>
            <p>Email: {client.email}</p>
            <p>Teléfono: {client.phone}</p>
            <p>Cupos disponibles: {client.available_slots}</p>

            {/* Sesiones */}
            <h3>Calendario de Sesiones</h3>
            <ul>
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <li key={session.id}>
                            {session.date} - {session.session_type}{" "}
                            {!session.clients?.includes(client_id) && (
                                <button onClick={() => handleAssignSession(session.id)}>
                                    Asignar a esta sesión
                                </button>
                            )}
                        </li>
                    ))
                ) : (
                    <li>No hay sesiones disponibles.</li>
                )}
            </ul>

            {/* Registro de créditos */}
            <h3>Registro de Créditos</h3>
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
                    {client.attendance_logs?.length > 0 ? (
                        client.attendance_logs.map((log) => (
                            <tr key={log.date}>
                                <td>{log.action}</td>
                                <td>{log.slots}</td>
                                <td>{log.description}</td>
                                <td>{new Date(log.date).toLocaleString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay registros de créditos.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ClientDetailPage;
