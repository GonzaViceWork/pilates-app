import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment-timezone";
import api from "../api/axios";

const CreateSessionPage = () => {
    const [newEvent, setNewEvent] = useState({
        date: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm"), // Fecha inicial en Lima
        session_type: "group",
        clients: [], // Clientes seleccionados (IDs)
    });
    const [clients, setClients] = useState([]); // Lista de todos los clientes
    const [selectedClients, setSelectedClients] = useState([]); // Clientes seleccionados con datos completos
    const navigate = useNavigate();

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

    const handleAddClient = (clientId) => {
        if (!newEvent.clients.includes(clientId)) {
            setNewEvent((prev) => {
                const updatedClients = [...prev.clients, clientId];
                return {
                    ...prev,
                    clients: updatedClients,
                };
            });
    
            const client = clients.find((c) => c.id === parseInt(clientId));
            if (client) {
                setSelectedClients((prev) => [...prev, client]);
            }
        }
    };

    const handleRemoveClient = (clientId) => {
        setNewEvent((prev) => {
            const updatedClients = prev.clients.filter((id) => {
                return parseInt(id) !== clientId;
            });
            return {
                ...prev,
                clients: updatedClients,
            };
        });
    
        setSelectedClients((prev) => 
            prev.filter((client) => parseInt(client.id) !== clientId) // Asegúrate de comparar como número
        );
    };

    const handleCreateSession = async () => {
        try {
            const utcDate = moment.tz(newEvent.date, "America/Lima").utc().format();

            await api.post("/sessions/", {
                date: utcDate,
                session_type: newEvent.session_type,
                clients: newEvent.clients, // Solo IDs de clientes seleccionados
            });

            navigate("/calendar/");
        } catch (error) {
            console.error("Error al crear la sesión:", error);
        }
    };

    return (
        <div>
            <h1>Crear nueva sesión</h1>
            <form>
                {/* Fecha y Hora */}
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={newEvent.date}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                date: e.target.value,
                            })
                        }
                    />
                </label>

                {/* Tipo de clase */}
                <label>
                    Tipo de clase:
                    <select
                        value={newEvent.session_type}
                        onChange={(e) =>
                            setNewEvent({ ...newEvent, session_type: e.target.value })
                        }
                    >
                        <option value="group">Grupal</option>
                        <option value="private">Privada</option>
                    </select>
                </label>

                {/* Asignar clientes */}
                <label>
                    Asignar clientes:
                    <select
                        onChange={(e) => handleAddClient(e.target.value)}
                        value=""
                    >
                        <option value="" disabled>
                            Seleccionar cliente
                        </option>
                        {clients
                            .filter((client) => !newEvent.clients.includes(client.id))
                            .map((client) => (
                                <option key={client.id} value={client.id}>
                                    {client.first_name} {client.last_name}
                                </option>
                            ))}
                    </select>
                </label>

                {/* Lista de clientes seleccionados */}
                <div>
                    <h3>Clientes seleccionados:</h3>
                    <ul>
                        {selectedClients.map((client) => (
                            <li key={client.id}>
                                {client.first_name} {client.last_name}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveClient(client.id)}
                                >
                                    Quitar
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Botón para crear sesión */}
                <button type="button" onClick={handleCreateSession}>
                    Crear sesión
                </button>
            </form>
        </div>
    );
};

export default CreateSessionPage;
