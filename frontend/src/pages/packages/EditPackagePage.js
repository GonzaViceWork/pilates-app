import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

const EditPackagePage = () => {
    const { package_id } = useParams();
    const [packageData, setPackageData] = useState({ name: "", slot_count: "", price: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                const response = await api.get(`/packages/${package_id}/`);
                setPackageData(response.data);
            } catch (error) {
                console.error("Error fetching package:", error);
            }
        };
        fetchPackage();
    }, [package_id]);

    const handleUpdate = async () => {
        try {
            await api.put(`/packages/${package_id}/`, packageData);
            navigate("/packages/");
        } catch (error) {
            console.error("Error updating package:", error);
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
        updateButton: {
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
            <h1 style={styles.title}>Editar paquete</h1>
            <div style={styles.form}>
                <input
                    type="text"
                    value={packageData.name}
                    onChange={(e) => setPackageData({ ...packageData, name: e.target.value })}
                    style={styles.input}
                    placeholder="Nombre del paquete"
                />
                <input
                    type="number"
                    value={packageData.slot_count}
                    onChange={(e) => setPackageData({ ...packageData, slot_count: e.target.value })}
                    style={styles.input}
                    placeholder="Número de slots"
                />
                <input
                    type="number"
                    value={packageData.price}
                    onChange={(e) => setPackageData({ ...packageData, price: e.target.value })}
                    style={styles.input}
                    placeholder="Precio"
                />
            </div>
            <div>
                <button onClick={handleUpdate} style={{ ...styles.button, ...styles.updateButton }}>
                    Actualizar
                </button>
                <button onClick={handleBack} style={{ ...styles.button, ...styles.backButton }}>
                    Volver
                </button>
            </div>
        </div>
    );
};

export default EditPackagePage;
