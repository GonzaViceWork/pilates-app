import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

const EditClientPage = () => {
    const { client_id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        cn_dni: "", // Incluimos el campo cn_dni
    });

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
                    cn_dni: response.data.cn_dni, // Inicializamos cn_dni con los datos del cliente
                });
            } catch (error) {
                console.error("Error al cargar los datos del cliente:", error);
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
            navigate(`/clients/${client_id}`); // Redirigir a la página de detalles del cliente
        } catch (error) {
            console.error("Error al actualizar el cliente:", error);
        }
    };

    return (
        <div>
            <h1>Editar Cliente</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Apellido:</label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Teléfono:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>DNI:</label>
                    <input
                        type="text"
                        name="cn_dni"
                        value={formData.cn_dni}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>

            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default EditClientPage;
