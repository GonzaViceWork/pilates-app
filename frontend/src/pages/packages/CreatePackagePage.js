import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CreatePackagePage = () => {
    const [newPackage, setNewPackage] = useState({ name: "", slot_count: "", price: "" });
    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
            await api.post("/packages/", newPackage);
            navigate("/packages/");
        } catch (error) {
            console.error("Error creating package:", error);
        }
    };

    const handleBack = () => {
        navigate("/packages/");
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
        form: {
            display: "flex",
            flexDirection: "column", // Apila los inputs de arriba a abajo
            alignItems: "center",
            gap: "10px", // Espacio entre los inputs
            width: "100%"
        },
        input: {
            padding: "10px",
            fontSize: "16px",
            width: "300px",
            border: "1px solid #ccc",
            borderRadius: "5px"
        },
        button: {
            padding: "10px 20px",
            fontSize: "14px",
            borderRadius: "5px",
            cursor: "pointer",
            border: "none",
            marginTop: "10px"
        },
        createButton: {
            backgroundColor: "#28a745",
            color: "white"
        },
        backButton: {
            backgroundColor: "#6c757d",
            color: "white"
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Crear nuevo paquete</h1>
            <div style={styles.form}>
                <input
                    type="text"
                    placeholder="Nombre"
                    value={newPackage.name}
                    onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Slots"
                    value={newPackage.slot_count}
                    onChange={(e) => setNewPackage({ ...newPackage, slot_count: e.target.value })}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Precio"
                    value={newPackage.price}
                    onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                    style={styles.input}
                />
            </div>
            <div>
                <button onClick={handleCreate} style={{ ...styles.button, ...styles.createButton }}>
                    Crear
                </button>
                <button onClick={handleBack} style={{ ...styles.button, ...styles.backButton }}>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default CreatePackagePage;
