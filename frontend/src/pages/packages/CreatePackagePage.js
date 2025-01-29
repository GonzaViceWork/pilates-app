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

    return (
        <div>
            <h1>Crear nuevo paquete</h1>
            <input type="text" placeholder="Nombre" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} />
            <input type="number" placeholder="Slots" value={newPackage.slot_count} onChange={(e) => setNewPackage({ ...newPackage, slot_count: e.target.value })} />
            <input type="number" placeholder="Precio" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} />
            <button onClick={handleCreate}>Crear</button>
            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default CreatePackagePage;