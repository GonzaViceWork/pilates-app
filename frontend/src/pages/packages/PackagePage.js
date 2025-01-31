import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const PackagePage = () => {
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await api.get("/packages/");
                setPackages(response.data);
            } catch (error) {
                console.error("Error fetching packages:", error);
            }
        };
        fetchPackages();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("¿Seguro que quieres eliminar este paquete?")) {
            try {
                await api.delete(`/packages/${id}/`);
                setPackages(packages.filter(pkg => pkg.id !== id));
            } catch (error) {
                console.error("Error deleting package:", error);
            }
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    // Estilos en objeto de JavaScript
    const styles = {
        container: {
            maxWidth: "900px",
            margin: "auto",
            padding: "20px",
            textAlign: "center"
        },
        title: {
            fontSize: "28px",
            marginBottom: "20px"
        },
        link: {
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            textDecoration: "none",
            cursor: "pointer",
            marginBottom: "20px",
            display: "inline-block"
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
        button: {
            padding: "5px 10px",
            fontSize: "14px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            height: "40px",
            marginRight: "10px"
        },
        editButton: {
            backgroundColor: "#ffc107",
            color: "black"
        },
        deleteButton: {
            backgroundColor: "#dc3545",
            color: "white"
        },
        backButton: {
            padding: "10px 20px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Paquetes</h1>
            <Link to="/packages/new" style={styles.link}>
                Crear nuevo paquete
            </Link>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Nombre</th>
                        <th style={styles.th}>Slots</th>
                        <th style={styles.th}>Precio (S/)</th>
                        <th style={styles.th}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map(pkg => (
                        <tr key={pkg.id}>
                            <td style={styles.td}>{pkg.name}</td>
                            <td style={styles.td}>{pkg.slot_count}</td>
                            <td style={styles.td}>{pkg.price}</td>
                            <td style={styles.td}>
                                <Link to={`/packages/${pkg.id}/edit`} style={{...styles.button, ...styles.editButton}}>Editar</Link>
                                <button onClick={() => handleDelete(pkg.id)} style={{...styles.button, ...styles.deleteButton}}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleBack} style={styles.backButton}>Volver</button>
        </div>
    );
};

export default PackagePage;
