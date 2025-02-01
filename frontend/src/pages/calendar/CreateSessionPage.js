import React, { useState, useEffect } from "react";
import { useNavigate} from "react-router-dom";
import moment from "moment-timezone";
import api from "../../api/axios";
import "./CreateSessionPage.css"; // Importar archivo de estilos

const CreateSessionPage = () => {
    const [newEvent, setNewEvent] = useState({
        date: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm"),
        session_type: "group",
        status: "pending",
        clients: [],
        room: "room_1",
    });
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/calendar");
    };

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get("/clients/");
                setClients(response.data);
            } catch (error) {
                console.error("Error al cargar los clientes:", error);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        setSelectedClients(
            clients.filter((client) => newEvent.clients.includes(client.id))
        );
    }, [newEvent.clients, clients]);

    const handleAddClient = (clientId) => {
        const clientIdNum = parseInt(clientId);
        if (!newEvent.clients.includes(clientIdNum)) {
            setNewEvent((prev) => ({
                ...prev,
                clients: [...prev.clients, clientIdNum],
            }));
        }
    };

    const handleRemoveClient = (clientId) => {
        setNewEvent((prev) => ({
            ...prev,
            clients: prev.clients.filter((id) => parseInt(id) !== clientId),
        }));
    };

    const handleCreateSession = async () => {
        try {
            const utcDate = moment.tz(newEvent.date, "America/Lima").utc().format();
            const response = await api.post("/sessions/", {
                date: utcDate,
                room: newEvent.room,
                session_type: newEvent.session_type,
                status: newEvent.status,
                clients: newEvent.clients,
                attended_clients: [],
            });
            // Redirigir con el ID de la sesión creada
            const sessionId = response.data.id;  // Aquí obtienes el id de la sesión
            navigate(`/calendar/${sessionId}`);  // Ahora navegas a la página de la sesión
        } catch (error) {
            console.error("Error al crear la sesión:", error);
        }
    };

    return (
        <div className="create-session-container">
            <h1 className="title">Crear nueva sesión</h1>
            <form className="session-form">
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                </label>

                <label>
                    Sala:
                    <select
                        value={newEvent.room}
                        onChange={(e) => setNewEvent({ ...newEvent, room: e.target.value })}
                    >
                        <option value="room_1">Sala 1</option>
                        <option value="room_2">Sala 2</option>
                    </select>
                </label>

                <label>
                    Tipo de clase:
                    <select
                        value={newEvent.session_type}
                        onChange={(e) => setNewEvent({ ...newEvent, session_type: e.target.value })}
                    >
                        <option value="group">Grupal</option>
                        <option value="private">Privada</option>
                    </select>
                </label>

                <label>
                    Estado:
                    <select
                        value={newEvent.status}
                        onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="finished">Terminada</option>
                    </select>
                </label>

                <label>
                    Asignar clientes:
                    <select onChange={(e) => handleAddClient(e.target.value)} value="">
                        <option value="" disabled>Seleccionar cliente</option>
                        {clients
                            .filter((client) => !newEvent.clients.includes(client.id))
                            .map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </option>
                            ))}
                    </select>
                </label>

                <div className="selected-clients">
                    <h3>Clientes seleccionados:</h3>
                    <ul>
                        {selectedClients.map((client) => (
                            <li key={client.id} className="client-item">
                                {client.first_name} {client.last_name}
                                <button
                                    type="button"
                                    className="remove-client-button"
                                    onClick={() => handleRemoveClient(client.id)}
                                >
                                    Quitar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <button type="button" className="create-session-button" onClick={handleCreateSession}>
                    Crear sesión
                </button>
            </form>

            <button className="back-button" onClick={handleBack}>Volver</button>
        </div>
    );
};

export default CreateSessionPage;
