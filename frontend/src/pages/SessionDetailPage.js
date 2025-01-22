import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const SessionDetailPage = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);

    useEffect(() => {
        fetchSession();
        fetchClients();
    }, []);

    const fetchSession = async () => {
        try {
            const response = await api.get(`/sessions/${session_id}/`);
            setSession(response.data);
            setSelectedClients(response.data.clients.map((client) => client.id));
        } catch (error) {
            console.error("Error al obtener la sesión:", error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients/");
            setClients(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    const handleClientChange = (clientId) => {
        setSelectedClients((prev) =>
            prev.includes(clientId)
                ? prev.filter((id) => id !== clientId)
                : [...prev, clientId]
        );
    };

    const handleMarkAttendance = async () => {
        try {
            await api.post(`/sessions/${session_id}/mark_attendance/`, {
                attended_clients: selectedClients,
            });
            alert("Asistencia registrada correctamente.");
            navigate("/calendar/");
        } catch (error) {
            console.error("Error al registrar la asistencia:", error);
        }
    };

    if (!session) {
        return <div>Cargando sesión...</div>;
    }

    // Filtramos los clientes asignados a la sesión
    const assignedClients = clients.filter(client =>
        session.clients.some(assignedClientId => assignedClientId === client.id)
    );

    return (
        <div>
            <h1>Sesión del {new Date(session.date).toLocaleDateString()}</h1>
            <p>Hora: {new Date(session.date).toLocaleTimeString()}</p>
            <p>Tipo: {session.session_type === "group" ? "Grupal" : "Privada"}</p>

            {/* Mostrar si no hay clientes asignados */}
            {assignedClients.length === 0 ? (
                <p>No hay clientes asignados a esta sesión.</p>
            ) : (
                <>
                    <h3>Asistencia</h3>
                    <p>Marca los clientes que asistieron a esta sesión:</p>
                    <ul>
                        {assignedClients.map((client) => (
                            <li key={client.id}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(client.id)}
                                        onChange={() => handleClientChange(client.id)}
                                    />
                                    {client.first_name} {client.last_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleMarkAttendance}>Clase terminada</button>
                </>
            )}
        </div>
    );
};

export default SessionDetailPage;
