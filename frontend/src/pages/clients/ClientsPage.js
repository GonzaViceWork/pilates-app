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
        if (window.confirm("¿Seguro que quieres eliminar este cliente?")) {
            try {
                await api.delete(`/clients/${id}/`);
                setClients(clients.filter((client) => client.id !== id));
            } catch (error) {
                console.error("Error al eliminar cliente:", error);
            }
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
        <div style={styles.container}>
            <h1 style={styles.title}>Gestión de Clientes</h1>
            
            {/* Barra de búsqueda y botón de ordenar */}
            <div style={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o apellido"
                    value={search}
                    onChange={handleSearch}
                    style={styles.searchInput}
                />
                <button onClick={handleSort} style={styles.sortButton}>
                    Ordenar por apellido ({sortOrder === "asc" ? "Ascendente" : "Descendente"})
                </button>
            </div>

            {/* Tabla de clientes */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Apellido</th>
                        <th style={styles.th}>Email</th>
                        <th style={styles.th}>Teléfono</th>
                        <th style={styles.th}>Clases</th>
                        <th style={styles.th}>DNI</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredClients.map((client) => (
                        <tr key={client.id}>
                            <td style={styles.td}>{client.first_name}</td>
                            <td style={styles.td}>{client.last_name}</td>
                            <td style={styles.td}>{client.email}</td>
                            <td style={styles.td}>{client.phone}</td>
                            <td style={styles.td}>{client.available_slots}</td>
                            <td style={styles.td}>{client.cn_dni}</td>
                            <td style={styles.td}>
                                <div style={styles.actions}>
                                    <Link to={`/clients/${client.id}/`}>
                                        <button style={styles.viewButton}>Ver</button>
                                    </Link>
                                    <Link to={`/clients/${client.id}/edit`}>
                                        <button style={styles.editButton}>Editar</button>
                                    </Link>
                                    <button onClick={() => handleDelete(client.id)} style={styles.deleteButton}>
                                        Eliminar
                                    </button>
                                </div> 
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Botón de nuevo cliente */}
            <Link to="/clients/new/" style={styles.createLink}>
                <button style={styles.createButton}>Crear nuevo cliente</button>
            </Link>

            {/* Botón de volver */}
            <button onClick={handleBack} style={styles.backButton}>Volver</button>
        </div>
    );
};

// 🎨 Estilos en línea
const styles = {
    container: {
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
    },
    title: {
        fontSize: "28px",
        marginBottom: "20px",
    },
    searchContainer: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginBottom: "20px",
    },
    searchInput: {
        padding: "10px",
        fontSize: "16px",
        width: "300px",
        border: "1px solid #ccc",
        borderRadius: "5px",
    },
    sortButton: {
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        marginBottom: "20px"
    },
    th: {
        padding: "10px",
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #ddd"
    },
    td: {
        padding: "10px",
        borderBottom: "1px solid #ddd"
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        gap: "5px",
    },
    viewButton: {
        backgroundColor: "#17a2b8",
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    editButton: {
        backgroundColor: "#ffc107",
        color: "black",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    deleteButton: {
        backgroundColor: "#dc3545",
        color: "white",
        padding: "5px 10px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    createLink: {
        textDecoration: "none",
    },
    createButton: {
        padding: "10px 20px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
    },
    backButton: {
        padding: "10px 20px",
        backgroundColor: "#6c757d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default ClientsPage;