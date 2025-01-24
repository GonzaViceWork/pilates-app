import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment-timezone";
import api from "../api/axios";

const EditSessionPage = () => {
    const [sessionData, setSessionData] = useState({
        date: moment().tz("America/Lima").format("YYYY-MM-DDTHH:mm"),
        session_type: "group",
        status: "pending",
        clients: [], // Lista de IDs de clientes asignados a la sesión
    });
    const [clients, setClients] = useState([]); // Lista de todos los clientes
    const [selectedClients, setSelectedClients] = useState([]); // Lista de clientes seleccionados (con datos completos)
    const navigate = useNavigate();
    const { session_id } = useParams();

    const handleBack = () => {
        navigate(`/calendar/${session_id}`);
    };

    // Cargar los datos de todos los clientes una vez al principio
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
    }, []); // Solo se ejecuta una vez al principio

    // Cargar los datos de la sesión cuando cambia session_id
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await api.get(`/sessions/${session_id}/`);
                const session = response.data;

                // Configurar los datos de la sesión
                setSessionData({
                    date: moment(session.date).tz("America/Lima").format("YYYY-MM-DDTHH:mm"),
                    session_type: session.session_type,
                    status: session.status,
                    clients: session.clients.map((id) => parseInt(id)), // Asegurar que los IDs sean numéricos
                });

                // Filtrar los clientes seleccionados de la lista de clientes
                const selectedClientsData = clients.filter((client) =>
                    session.clients.includes(client.id) // Compara los IDs con los de la sesión
                );
                setSelectedClients(selectedClientsData); // Actualizar el estado de los clientes seleccionados
            } catch (error) {
                console.error("Error al obtener la sesión:", error);
            }
        };

        if (session_id) {
            fetchSession();
        }
    }, [session_id, clients]); // Ejecutar cuando cambie session_id y clients

    // Manejar la adición de clientes a la sesión
    const handleAddClient = (clientId) => {
        const clientIdNum = parseInt(clientId); // Convertir el ID del cliente a número
        if (!sessionData.clients.includes(clientIdNum)) {
            setSessionData((prev) => {
                const updatedClients = [...prev.clients, clientIdNum];
                return { ...prev, clients: updatedClients };
            });

            const client = clients.find((c) => c.id === clientIdNum);
            if (client) {
                setSelectedClients((prev) => [...prev, client]);
            }
        }
    };

    // Manejar la eliminación de clientes de la sesión
    const handleRemoveClient = (clientId) => {
        const clientIdNum = parseInt(clientId); // Convertir el ID del cliente a número
        setSessionData((prev) => {
            const updatedClients = prev.clients.filter(
                (id) => id !== clientIdNum
            );
            return { ...prev, clients: updatedClients };
        });

        setSelectedClients((prev) =>
            prev.filter((client) => client.id !== clientIdNum)
        );
    };

    // Guardar la sesión con los clientes actualizados
    const handleSaveSession = async () => {
        try {
            await api.put(`/sessions/${session_id}/`, {
                date: moment.tz(sessionData.date, "America/Lima").utc().format(),
                session_type: sessionData.session_type,
                status: sessionData.status,
                clients: sessionData.clients,  // Solo los IDs de clientes
                attended_clients: sessionData.attended_clients || [],  // Enviar vacía si no hay clientes atendidos
            });
            navigate(`/calendar/${session_id}`);
        } catch (error) {
            if (error.response) {
                console.error("Error al guardar la sesión:", error.response.data);
            } else {
                console.error("Error desconocido:", error);
            }
        }
    };

    return (
        <div>
            <h1>Editar sesión</h1>
            <form>
                {/* Fecha y Hora */}
                <label>
                    Fecha y Hora:
                    <input
                        type="datetime-local"
                        value={sessionData.date}
                        onChange={(e) =>
                            setSessionData({
                                ...sessionData,
                                date: e.target.value,
                            })
                        }
                    />
                </label>

                {/* Tipo de clase */}
                <label>
                    Tipo de clase:
                    <select
                        value={sessionData.session_type}
                        onChange={(e) =>
                            setSessionData({
                                ...sessionData,
                                session_type: e.target.value,
                            })
                        }
                    >
                        <option value="group">Grupal</option>
                        <option value="private">Privada</option>
                    </select>
                </label>

                {/* Estado */}
                <label>
                    Estado:
                    <select
                        value={sessionData.status}
                        onChange={(e) =>
                            setSessionData({
                                ...sessionData,
                                status: e.target.value,
                            })
                        }
                    >
                        <option value="pending">Pendiente</option>
                        <option value="finished">Terminada</option>
                    </select>
                </label>

                {/* Asignar clientes */}
                <label>
                    Asignar clientes:
                    <select onChange={(e) => handleAddClient(e.target.value)} value="">
                        <option value="" disabled>Seleccionar cliente</option>
                        {clients
                            .filter(
                                (client) =>
                                    !sessionData.clients.includes(client.id)
                            )
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

                {/* Botón para guardar sesión */}
                <button type="button" onClick={handleSaveSession}>
                    Guardar sesión
                </button>
            </form>

            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default EditSessionPage;