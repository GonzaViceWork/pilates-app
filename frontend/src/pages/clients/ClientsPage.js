import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const ClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/");
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await api.get("/clients/");
            setClients(response.data);
        } catch (error) {
            console.error("Error al obtener los clientes:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/clients/${id}/`);
            setClients(clients.filter((client) => client.id !== id));
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    const handleSearch = (event) => {
        setSearch(event.target.value.toLowerCase());
    };

    const handleSort = () => {
        const sortedClients = [...clients].sort((a, b) => {
            if (a.last_name < b.last_name) return sortOrder === "asc" ? -1 : 1;
            if (a.last_name > b.last_name) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });
        setClients(sortedClients);
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    const filteredClients = clients.filter(
        (client) =>
            client.first_name.toLowerCase().includes(search) ||
            client.last_name.toLowerCase().includes(search)
    );

    return (
        <div>
            <h1>Gestión de Clientes</h1>
            <input
                type="text"
                placeholder="Buscar por nombre o apellido"
                value={search}
                onChange={handleSearch}
            />
            <button onClick={handleSort}>
                Ordenar por apellido ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
            </button>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Cupos</th>
                        <th>DNI</th> {/* Nueva columna para CN DNI */}
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.first_name}</td>
                            <td>{client.last_name}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            <td>{client.available_slots}</td>
                            <td>{client.cn_dni}</td> {/* Muestra el CN DNI */}
                            <td>
                                <Link to={`/clients/${client.id}/`}>
                                    <button>Ver</button>
                                </Link>
                                <Link to={`/clients/${client.id}/edit`}>
                                    <button>Editar</button>
                                </Link>
                                <button onClick={() => handleDelete(client.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/clients/new/">Crear nuevo cliente</Link>

            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default ClientsPage;
