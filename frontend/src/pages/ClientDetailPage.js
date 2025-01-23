import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import api from "../api/axios";

const ClientDetailPage = () => {
    const { client_id } = useParams();
    const [client, setClient] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [packages, setPackages] = useState([]);
    const [selectedPackage, setSelectedPackage] = useState("");

    const localizer = momentLocalizer(moment);

    const fetchClient = useCallback(async () => {
        try {
            const response = await api.get(`/clients/${client_id}/`);
            setClient(response.data);
        } catch (error) {
            console.error("Error al obtener el cliente:", error);
        }
    }, [client_id]);

    const fetchSessions = useCallback(async () => {
        try {
            const response = await api.get(`/sessions/?client_id=${client_id}`);
            console.log(response.data); // Ver la respuesta completa
            const assignedSessions = response.data.filter(session =>
                session.clients?.includes(parseInt(client_id))  // Verifica si 'client.id' existe
            );
            console.log(assignedSessions);  // Verifica las sesiones filtradas
            setSessions(assignedSessions);
        } catch (error) {
            console.error("Error al obtener las sesiones:", error);
        }
    }, [client_id]);

    const fetchAttendanceLogs = useCallback(async () => {
        try {
            const response = await api.get(`/clients/${client_id}/attendance_logs/`);
            setAttendanceLogs(response.data);
        } catch (error) {
            console.error("Error al obtener los registros de créditos:", error);
        }
    }, [client_id]);

    const fetchPackages = async () => {
        try {
            const response = await api.get("/packages/");
            setPackages(response.data);
        } catch (error) {
            console.error("Error al obtener los paquetes:", error);
        }
    };

    const handleAddPackage = async () => {
        if (!selectedPackage) {
            alert("Por favor, selecciona un paquete.");
            return;
        }
        try {
            await api.post(`/clients/${client_id}/assign_package/`, {
                package_id: selectedPackage,
            });
            fetchClient();
            fetchAttendanceLogs();
            alert("Paquete asignado correctamente.");
        } catch (error) {
            console.error("Error al asignar el paquete:", error);
        }
    };

    useEffect(() => {
        fetchClient();
        fetchSessions();
        fetchAttendanceLogs();
        fetchPackages();
    }, [fetchClient, fetchSessions, fetchAttendanceLogs]);

    if (!client) {
        return <div>Cargando cliente...</div>;
    }

    const events = sessions.map(session => ({
        id: session.id,
        title: `${session.session_type === "group" ? "Sesión Grupal" : "Sesión Privada"} - ${moment(session.date).format("DD-MM-YYYY h:mm A")}`,
        start: new Date(session.date),
        end: new Date(session.date),
    }));

    return (
        <div>
            <h1>
                {client.first_name} {client.last_name}
            </h1>
            <p>Email: {client.email}</p>
            <p>Teléfono: {client.phone}</p>
            <p>CN/DNI: {client.cn_dni}</p>
            <p>Cupos disponibles: {client.available_slots}</p>

            <Link to={`/clients/${client_id}/edit`}>
                <button>Editar Cliente</button>
            </Link>

            <h3>Calendario de Sesiones</h3>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "50px 0" }}
                firstDayOfWeek={1}
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
                eventPropGetter={(event) => ({
                    className: "session-event",  // Puedes agregar clases personalizadas si lo deseas
                })}
                onSelectEvent={(event) => {
                    // Redirige al usuario a la página de la sesión al hacer clic
                    window.location.href = `/calendar/${event.id}/`;
                }}
            />

            <h3>Registro de Créditos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Acción</th>
                        <th>Cupos</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceLogs.length > 0 ? (
                        attendanceLogs.map((log) => (
                            <tr key={log.date}>
                                <td>{log.action === "add" ? "Paquete Asignado" : "Clase Asistida"}</td>
                                <td>{log.slots}</td>
                                <td>{log.description}</td>
                                <td>
                                    {log.date
                                        ? moment(log.date, "DD-MM-YYYY hh:mm A").format(
                                            "D [de] MMMM [de] YYYY, h:mm A"
                                        )
                                        : "Fecha no disponible"}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4">No hay registros de créditos.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Asignar Paquete</h3>
            <div>
                <select
                    value={selectedPackage}
                    onChange={(e) => setSelectedPackage(e.target.value)}
                >
                    <option value="">Selecciona un paquete</option>
                    {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                            {pkg.name} ({pkg.slot_count} cupos)
                        </option>
                    ))}
                </select>
                <button onClick={handleAddPackage}>Asignar Paquete</button>
            </div>
        </div>
    );
};

export default ClientDetailPage;
