import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import api from "../api/axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configuración de localización
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [sessions, setSessions] = useState([]);
    const [clients, setClients] = useState([]); // Estado para los clientes
    const [newEvent, setNewEvent] = useState({
        title: "",
        start: new Date(),
        end: new Date(),
        session_type: "group",
        clients: [], // Inicializar como un array vacío
    });

    useEffect(() => {
        fetchSessions();
        fetchClients(); // Llamar a la función que obtiene los clientes
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.get("/sessions/");
            const formattedSessions = response.data.map((session) => ({
                ...session,
                start: new Date(session.date),
                end: new Date(session.date),
            }));
            setSessions(formattedSessions);
        } catch (error) {
            console.error("Error al obtener las sesiones:", error);
        }
    };

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients/"); // Asegúrate de que la ruta sea correcta
            setClients(response.data); // Establecer los clientes en el estado
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    const handleSelectSlot = ({ start, end }) => {
        setNewEvent({
            ...newEvent,
            start,
            end,
        });
    };

    const handleCreateSession = async () => {
        try {
            await api.post("/sessions/", {
                ...newEvent,
                date: newEvent.start.toISOString(),
            });
            fetchSessions(); // Recargar sesiones
            setNewEvent({ title: "", start: new Date(), end: new Date(), session_type: "group", clients: [] });
        } catch (error) {
            console.error("Error al crear la sesión:", error);
        }
    };

    const handleSelectEvent = (event) => {
        setNewEvent({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
        });
    };

    const handleUpdateSession = async () => {
        try {
            await api.put(`/sessions/${newEvent.id}/`, {
                ...newEvent,
                date: newEvent.start.toISOString(),
            });
            fetchSessions();
        } catch (error) {
            console.error("Error al actualizar la sesión:", error);
        }
    };

    const handleDeleteSession = async () => {
        try {
            await api.delete(`/sessions/${newEvent.id}/`);
            fetchSessions();
            setNewEvent({ title: "", start: new Date(), end: new Date(), session_type: "group", clients: [] });
        } catch (error) {
            console.error("Error al eliminar la sesión:", error);
        }
    };

    return (
        <div>
            <h1>Calendario de Sesiones</h1>
            <Link to="/calendar/new/">Crear nueva sesión</Link>

            {/* Renderizar calendario */}
            <Calendar
                localizer={localizer}
                events={sessions}
                startAccessor="start"
                endAccessor="end"
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable
                views={["month", "week", "day"]}
            />

            {/* Formulario para crear/editar sesión */}
            <h2>{newEvent.id ? "Actualizar sesión" : "Crear nueva sesión"}</h2>
            <form>
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={newEvent.start.toISOString().slice(0, 16)} // Convertir a formato compatible
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                start: new Date(e.target.value),
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

export default CalendarPage;
