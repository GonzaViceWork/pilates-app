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
        <div>
            <h1>Crear Nuevo Cliente</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="first_name">Nombre:</label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="last_name">Apellido:</label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="phone">Teléfono:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="cn_dni">CN/DNI:</label>
                    <input
                        type="text"
                        id="cn_dni"
                        name="cn_dni"
                        value={formData.cn_dni}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="available_slots">Cupos Disponibles:</label>
                    <input
                        type="number"
                        id="available_slots"
                        name="available_slots"
                        value={formData.available_slots}
                        onChange={handleChange}
                        min="0"
                    />
                </div>
                <button type="submit">Crear Cliente</button>
            </form>
            
            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default CreateClientPage;
