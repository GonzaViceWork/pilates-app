import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const SessionDetailPage = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);

    const handleBack = () => {
        navigate(`/calendar`);
    };

    const handleDeleteSession = async () => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta sesión?")) {
            try {
                await api.delete(`/sessions/${session_id}/`);
                alert("Sesión eliminada correctamente.");
                navigate("/calendar/"); // Redirige al calendario después de eliminar
            } catch (error) {
                console.error("Error al eliminar la sesión:", error);
                alert("Hubo un error al eliminar la sesión.");
            }
        }
    };

    // Uso de useCallback para evitar que la función se redefine
    const fetchSession = useCallback(async () => {
        try {
            const response = await api.get(`/sessions/${session_id}/`);
            setSession(response.data);
            setSelectedClients(response.data.clients.map((client) => client.id));
        } catch (error) {
            console.error("Error al obtener la sesión:", error);
        }
    }, [session_id]);

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients/");
            setClients(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    useEffect(() => {
        fetchSession();
        fetchClients();
    }, [fetchSession]);

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
                attended_clients: selectedClients,  // Clientes que asistieron
                status: 'finished',  // Cambiar el estado de la sesión a "terminada"
            });

            // Después de marcar la asistencia, actualiza el estado de la sesión y los clientes que asistieron
            setSession((prevSession) => ({
                ...prevSession,
                attended_clients: selectedClients, // Actualizamos los clientes que asistieron
                status: "finished", // Cambiar el estado de la sesión a 'Terminada'
            }));

            alert("Asistencia registrada correctamente.");
            navigate("/calendar/");  // Redirigir al calendario
        } catch (error) {
            console.error("Error al registrar la asistencia:", error);
            alert("Hubo un error al registrar la asistencia.");
        }
    };

    if (!session) {
        return <div>Cargando sesión...</div>;
    }

    // Filtramos los clientes asignados a la sesión
    const assignedClients = clients.filter(client =>
        session.clients.some(assignedClientId => assignedClientId === client.id)
    );

    // Cuando los clientes hayan asistido, esos checkboxes deben estar marcados
    const isAttended = (clientId) => {
        return session.attended_clients.includes(clientId); // Comprobar si el cliente ya ha asistido
    };

    return (
        <div>
            <h1>Sesión del {new Date(session.date).toLocaleDateString()}</h1>
            <p>Hora: {new Date(session.date).toLocaleTimeString()}</p>
            <p>Tipo: {session.session_type === "group" ? "Grupal" : "Privada"}</p>

            {/* Mostrar el estado de la sesión */}
            <p>Estado: {session.status === "pending" ? "Pendiente" : "Terminada"}</p>

            {/* Enlace para editar la sesión */}
            {session.status !== "finished" && (
                <p>
                    <a href={`/calendar/${session.id}/edit`}>Editar sesión</a>
                </p>
            )}

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
                                        checked={selectedClients.includes(client.id) || isAttended(client.id)} // Deja marcado si asistió
                                        onChange={() => handleClientChange(client.id)}
                                        disabled={session.status === "finished"} // Deshabilitar los checkboxes si la sesión está terminada
                                    />
                                    {client.first_name} {client.last_name}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleMarkAttendance}>Clase terminada</button>
                </>
            )}

            <button onClick={handleBack}>Volver</button>
            <button onClick={handleDeleteSession} style={{ marginLeft: "10px", color: "white", backgroundColor: "red" }}>
                Eliminar sesión
            </button>
        </div>
    );
};

export default SessionDetailPage;
