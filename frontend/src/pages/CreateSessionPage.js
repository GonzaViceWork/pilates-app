import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Cambiar de useHistory a useNavigate
import api from "../api/axios";

const CreateSessionPage = () => {
    const [newEvent, setNewEvent] = useState({
        date: new Date(),
        session_type: "group", // Valor por defecto
        clients: [], // Lista de clientes asignados
    });
    const [clients, setClients] = useState([]); // Lista de todos los clientes
    const navigate = useNavigate(); // Cambiar de useHistory a useNavigate

    useEffect(() => {
        // Aquí deberías cargar los clientes desde la API para mostrarlos en el select
        const fetchClients = async () => {
            try {
                const response = await api.get("/clients/");
                setClients(response.data); // Guardamos los clientes en el estado
            } catch (error) {
                console.error("Error al cargar los clientes:", error);
            }
        };
        fetchClients();
    }, []);

    const handleCreateSession = async () => {
        try {
            const response = await api.post("/sessions/", {
                date: newEvent.date.toISOString(),
                session_type: newEvent.session_type,
                clients: newEvent.clients, // Lista de clientes asignados
            });

            // Redirigir al calendario después de crear la sesión
            navigate("/calendar/");
        } catch (error) {
            console.error("Error al crear la sesión:", error);
        }
    };

    return (
        <div>
            <h1>Crear nueva sesión</h1>
            <form>
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={newEvent.date.toISOString().slice(0, 16)} // Convertir a formato compatible
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                date: new Date(e.target.value),
                            })
                        }
                    />
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

                {/* Formulario para asignar clientes */}
                <label>
                    Asignar clientes:
                    <select
                        multiple
                        value={newEvent.clients}
                        onChange={(e) => {
                            const selectedClients = Array.from(e.target.selectedOptions, option => option.value);
                            setNewEvent({ ...newEvent, clients: selectedClients });
                        }}
                    >
                        {/* Aquí cargamos los clientes desde el estado */}
                        {clients.map(client => (
                            <option key={client.id} value={client.id}>
                                {client.first_name} {client.last_name}
                            </option>
                        ))}
                    </select>
                </label>

                <button type="button" onClick={handleCreateSession}>
                    Crear sesión
                </button>
            </form>
        </div>
    );
};

export default CreateSessionPage;
