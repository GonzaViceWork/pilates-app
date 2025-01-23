import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import api from "../api/axios";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configuración de localización
const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate(); // Hook para navegar a otras páginas

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.get("/sessions/");
            const formattedSessions = response.data.map((session) => {
                const sessionDate = moment(session.date).format("DD/MM/YYYY HH:mm"); // Formato de fecha legible
                return {
                    ...session,
                    title: `${session.session_type === "group" ? "Sesión Grupal" : "Sesión Privada"} - ${moment(session.date).format("DD-MM-YYYY h:mm A")}`,
                    start: new Date(session.date),
                    end: new Date(session.date),
                };
            });
            setSessions(formattedSessions);
        } catch (error) {
            console.error("Error al obtener las sesiones:", error);
        }
    };

    const handleSelectEvent = (event) => {
        navigate(`/calendar/${event.id}/`); // Redirige al detalle de la sesión
    };

    return (
        <div>
            <h1>Calendario de Sesiones</h1>
            
            {/* Título para el link de nueva sesión */}
            <h3>Acciones</h3>
            <Link to="/calendar/new/">Crear nueva sesión</Link>

            {/* Renderizar calendario */}
            <h3>Calendario de Sesiones</h3>
            <Calendar
                localizer={localizer}
                events={sessions}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                style={{ height: 500, margin: "50px 0" }}
                selectable
                views={["month", "week", "day"]}
                messages={{
                    today: "Hoy",
                    previous: "Anterior",
                    next: "Siguiente",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    agenda: "Agenda",
                    date: "Fecha",
                    time: "Hora",
                    event: "Evento",
                }}
                firstDayOfWeek={1} // La semana comienza el lunes
            />
        </div>
    );
};

export default CalendarPage;