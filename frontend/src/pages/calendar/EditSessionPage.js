import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import api from "../../api/axios";
import "./EditSessionPage.css";

const EditSessionPage = () => {
    const [sessionData, setSessionData] = useState({
        date: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm"),
        session_type: "group",
        room: "room_1",
        status: "pending",
        clients: [],
    });
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const navigate = useNavigate();
    const { session_id } = useParams();

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await api.get("/clients/");
                setClients(response.data);
            } catch (error) {
                console.error("Error al obtener los clientes:", error);
            }
        };
        fetchClients();
    }, []);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await api.get(`/sessions/${session_id}/`);
                const session = response.data;
                setSessionData({
                    date: moment(session.date).tz("America/Lima").format("YYYY-MM-DDTHH:mm"),
                    room: session.room,
                    session_type: session.session_type,
                    status: session.status,
                    clients: session.clients.map(String),
                });
                setSelectedClients(clients.filter(client => session.clients.includes(client.id)));
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
            }
        };
        if (session_id) fetchSession();
    }, [session_id, clients]);

    useEffect(() => {
        setSelectedClients(
            clients.filter(client => sessionData.clients.includes(String(client.id)))
        );
    }, [sessionData.clients, clients]);
    

    const handleAddClient = (clientId) => {
        const clientIdStr = String(clientId);
        if (!sessionData.clients.includes(clientIdStr)) {
            setSessionData(prev => ({
                ...prev,
                clients: [...prev.clients, clientIdStr],
            }));
            const client = clients.find(c => c.id === clientId);
            if (client) setSelectedClients(prev => [...prev, client]);
        }
    };

    const handleRemoveClient = (clientId) => {
        setSessionData(prev => ({
            ...prev,
            clients: prev.clients.filter(id => String(id) !== String(clientId)),
        }));
        setSelectedClients(prev => prev.filter(client => String(client.id) !== String(clientId)));
    };

    const handleSaveSession = async () => {
        try {
            await api.put(`/sessions/${session_id}/`, {
                date: moment.tz(sessionData.date, "America/Lima").utc().format(),
                session_type: sessionData.session_type,
                status: sessionData.status,
                clients: sessionData.clients,
                attended_clients: sessionData.attended_clients || [],
                room: sessionData.room,
            });
            navigate(`/calendar/${session_id}`);
        } catch (error) {
            console.error("Error al guardar la sesión:", error.response?.data || error);
        }
    };

    return (
        <div className="edit-session-container">
            <h1 className="title">Editar sesión</h1>
            <form className="session-form">
                <label>
                    Fecha y Hora:
                    <input type="datetime-local" value={sessionData.date} onChange={(e) => setSessionData({ ...sessionData, date: e.target.value })} />
                </label>
                <label>
                    Sala:
                    <select value={sessionData.room} onChange={(e) => setSessionData({ ...sessionData, room: e.target.value })}>
                        <option value="room_1">Sala 1</option>
                        <option value="room_2">Sala 2</option>
                    </select>
                </label>
                <label>
                    Tipo de clase:
                    <select value={sessionData.session_type} onChange={(e) => setSessionData({ ...sessionData, session_type: e.target.value })}>
                        <option value="group">Grupal</option>
                        <option value="private">Privada</option>
                    </select>
                </label>
                <label>
                    Estado:
                    <select value={sessionData.status} onChange={(e) => setSessionData({ ...sessionData, status: e.target.value })}>
                        <option value="pending">Pendiente</option>
                        <option value="finished">Terminada</option>
                    </select>
                </label>
                <label>
                    Asignar clientes:
                    <select onChange={(e) => handleAddClient(e.target.value)} value="">
                        <option value="" disabled>Seleccionar cliente</option>
                        {clients.filter(client => !sessionData.clients.includes(String(client.id))).map(client => (
                            <option key={client.id} value={client.id}>{client.first_name} {client.last_name}</option>
                        ))}
                    </select>
                </label>
                <div className="selected-clients">
                    <h3>Clientes seleccionados:</h3>
                    <ul>
                        {selectedClients.map(client => (
                            <li key={client.id} className="client-item">
                                {client.first_name} {client.last_name}
                                <button type="button" className="remove-client-button" onClick={() => handleRemoveClient(client.id)}>Quitar</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <button type="button" className="save-session-button" onClick={handleSaveSession}>Guardar sesión</button>
            </form>
            <button className="back-button" onClick={() => navigate(`/calendar/${session_id}`)}>Volver</button>
        </div>
    );
};

export default EditSessionPage;