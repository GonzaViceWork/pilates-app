import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const EditClientPage = () => {
    const { client_id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        cn_dni: "",
    });
    const [error, setError] = useState("");

    const handleBack = () => {
        navigate(`/clients/${client_id}`);
    };

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const response = await api.get(`/clients/${client_id}/`);
                setFormData({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email,
                    phone: response.data.phone,
                    cn_dni: response.data.cn_dni,
                });
            } catch (error) {
                console.error("Error al cargar los datos del cliente:", error);
                setError("No se pudieron cargar los datos del cliente.");
            }
        };
        fetchClient();
    }, [client_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/clients/${client_id}/`, formData);
            alert("Cliente actualizado con éxito.");
            navigate(`/clients/${client_id}`);
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
            setError("Hubo un problema al actualizar el cliente.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Editar Cliente</h1>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Apellido:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>Teléfono:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label style={styles.label}>DNI:</label>
                    <input
                        type="text"
                        name="cn_dni"
                        value={formData.cn_dni}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.submitButton}>Guardar Cambios</button>
            </form>

            <button onClick={handleBack} style={styles.backButton}>Volver</button>
        </div>
    );
};

// 🎨 Estilos en línea
const styles = {
    container: {
        maxWidth: "500px",
        margin: "auto",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "24px",
        marginBottom: "20px",
        color: "#333",
    },
    errorMessage: {
        color: "red",
        fontSize: "14px",
        marginBottom: "10px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        marginBottom: "10px",
    },
    label: {
        fontSize: "16px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    input: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "1px solid #ccc",
    },
    submitButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px",
    },
    backButton: {
        marginTop: "15px",
        padding: "10px",
        backgroundColor: "#6c757d",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default EditClientPage;
