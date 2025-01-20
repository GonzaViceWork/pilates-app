import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const CreateClientPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
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
                <button type="submit">Crear Cliente</button>
            </form>
        </div>
    );
};

export default CreateClientPage;
