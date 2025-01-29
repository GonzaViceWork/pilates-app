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

    return (
        <div>
            <h1>Editar paquete</h1>
            <input type="text" value={packageData.name} onChange={(e) => setPackageData({ ...packageData, name: e.target.value })} />
            <input type="number" value={packageData.slot_count} onChange={(e) => setPackageData({ ...packageData, slot_count: e.target.value })} />
            <input type="number" value={packageData.price} onChange={(e) => setPackageData({ ...packageData, price: e.target.value })} />
            <button onClick={handleUpdate}>Actualizar</button>
            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default EditPackagePage;