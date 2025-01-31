import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import api from "../../api/axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarPage.css"; // Importar el archivo de estilos

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            const response = await api.get("/sessions/");
            const formattedSessions = response.data.map((session) => ({
                ...session,
                title: `${session.session_type === "group" ? "Sesión Grupal" : "Sesión Privada"} - ${moment(session.date).format("DD-MM-YYYY h:mm A")}`,
                start: new Date(session.date),
                end: new Date(session.date),
            }));
            setSessions(formattedSessions);
        } catch (error) {
            console.error("Error al obtener las sesiones:", error);
        }
    };

    const handleSelectEvent = (event) => {
        navigate(`/calendar/${event.id}/`);
    };

    return (
        <div className="calendar-container">
            <h1 className="calendar-title">Calendario de Sesiones</h1>

            <div className="calendar-actions">
                <h3>Acciones</h3>
                <Link to="/calendar/new/" className="calendar-link">Crear nueva sesión</Link>
            </div>

            <h3>Calendario</h3>
            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={sessions}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleSelectEvent}
                    style={{ height: 500 }}
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
                    firstDayOfWeek={1}
                />
            </div>

            <button className="back-button" onClick={handleBack}>Volver</button>
        </div>
    );
};

export default CalendarPage;
