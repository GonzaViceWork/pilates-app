import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreateClientPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        cn_dni: "", // Nuevo campo
        available_slots: 0, // Nuevo campo con valor inicial
    });
    const [error, setError] = useState("");

    const handleBack = () => {
        navigate("/clients");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "available_slots" ? parseInt(value) || 0 : value, // Parsear a número si es available_slots
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/clients/", formData);
            navigate("/clients/"); // Redirigir a la página de clientes después de la creación
        } catch (err) {
            console.error("Error al crear cliente:", err);
            setError("Hubo un problema al crear el cliente. Por favor, revisa los datos ingresados.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Crear Nuevo Cliente</h1>
            {error && <p style={styles.errorMessage}>{error}</p>}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label htmlFor="first_name" style={styles.label}>Nombre:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="last_name" style={styles.label}>Apellido:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="email" style={styles.label}>Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="phone" style={styles.label}>Teléfono:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="cn_dni" style={styles.label}>CN/DNI:</label>
                    <input
                        type="text"
                        id="cn_dni"
                        name="cn_dni"
                        value={formData.cn_dni}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.inputGroup}>
                    <label htmlFor="available_slots" style={styles.label}>Clases Disponibles:</label>
                    <input
                        type="number"
                        id="available_slots"
                        name="available_slots"
                        value={formData.available_slots}
                        onChange={handleChange}
                        min="0"
                        style={styles.input}
                    />
                </div>
                <button type="submit" style={styles.submitButton}>Crear Cliente</button>
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
        backgroundColor: "#28a745",
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

export default CreateClientPage;
