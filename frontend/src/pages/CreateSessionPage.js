import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Cambiar de useHistory a useNavigate
import moment from "moment-timezone";
import api from "../api/axios";

const CreateSessionPage = () => {
    const [newEvent, setNewEvent] = useState({
        date: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm"), // Fecha inicial en la zona horaria de Lima
        session_type: "group", // Valor por defecto
        clients: [], // Lista de clientes asignados
    });
    const [clients, setClients] = useState([]); // Lista de todos los clientes
    const navigate = useNavigate();

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
            // Convertir la fecha a UTC antes de enviarla al backend
            const utcDate = moment.tz(newEvent.date, "America/Lima").utc().format();
            await api.post("/sessions/", {
                date: utcDate,
                session_type: newEvent.session_type,
                clients: newEvent.clients,
            });
            navigate("/calendar/");
        } catch (error) {
            console.error("Error al crear la sesión:", error);
        }
    };

    const formatDateForInput = (date) => {
        // Formatear la fecha para el input de tipo datetime-local
        return date.toISOString().slice(0, 16);
    };

    const handleDateChange = (e) => {
        // Convertir la fecha seleccionada en el input a un objeto Date local
        const selectedDate = new Date(e.target.value);
        setNewEvent({ ...newEvent, date: selectedDate });
    };

    return (
        <div>
            <h1>Crear nueva sesión</h1>
            <form>
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={newEvent.date}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                date: e.target.value, // Captura la fecha directamente como string
                            })
                        }
                    />
                </label>

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

                {/* Formulario para asignar clientes */}
                <label>
                    Asignar clientes:
                    <select
                        multiple
                        value={newEvent.clients}
                        onChange={(e) => {
                            const selectedClients = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                            );
                            setNewEvent({ ...newEvent, clients: selectedClients });
                        }}
                    >
                        {clients.map((client) => (
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
