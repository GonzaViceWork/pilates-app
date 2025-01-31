import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "./SessionDetailPage.css"; // Asegúrate de importar el CSS

const SessionDetailPage = () => {
    const { session_id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);

    const handleBack = () => {
        navigate("/calendar");
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

    const assignedClients = clients.filter(client =>
        session.clients.some(assignedClientId => assignedClientId === client.id)
    );

    const isAttended = (clientId) => {
        return session.attended_clients.includes(clientId); // Comprobar si el cliente ya ha asistido
    };

    return (
        <div className="session-detail-container">
            <h1 className="session-title">Sesión del {new Date(session.date).toLocaleDateString()}</h1>
            
            <div className="session-info">
                <p>Hora: {new Date(session.date).toLocaleTimeString()}</p>
                <p>Tipo: {session.session_type === "group" ? "Grupal" : "Privada"}</p>
                
                <p className={`session-status ${session.status}`}>
                    Estado: {session.status === "pending" ? "Pendiente" : "Terminada"}
                </p>

                {session.status !== "finished" && (
                    <Link to={`/calendar/${session.id}/edit`} className="edit-session-link">
                        Editar sesión
                    </Link>
                )}
            </div>

            <div className="assistance-section">
                {assignedClients.length === 0 ? (
                    <p>No hay clientes asignados a esta sesión.</p>
                ) : (
                    <>
                        <h3>Asistencia</h3>
                        <p>Marca los clientes que asistieron a esta sesión:</p>
                        <ul className="assistance-list">
                            {assignedClients.map((client) => (
                                <li key={client.id}>
                                    <input
                                        type="checkbox"
                                        checked={selectedClients.includes(client.id) || isAttended(client.id)}
                                        onChange={() => handleClientChange(client.id)}
                                        disabled={session.status === "finished"}
                                    />
                                    {client.first_name} {client.last_name}
                                </li>
                            ))}
                        </ul>
                        {session.status !== "finished" && (
                            <div className="button-container">
                                <button 
                                    className="detail-button mark-attendance-button"
                                    onClick={handleMarkAttendance}
                                >
                                    Clase terminada
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="button-container">
                <button 
                    className="detail-button back-button"
                    onClick={handleBack}
                >
                    Volver
                </button>
                <button 
                    className="detail-button delete-button"
                    onClick={handleDeleteSession}
                >
                    Eliminar sesión
                </button>
            </div>
        </div>
    );
};

export default SessionDetailPage;
