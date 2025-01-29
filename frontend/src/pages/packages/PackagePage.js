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

    return (
        <div>
            <h1>Paquetes</h1>
            <Link to="/packages/new">Crear nuevo paquete</Link>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Slots</th>
                        <th>Precio (S/)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {packages.map(pkg => (
                        <tr key={pkg.id}>
                            <td>{pkg.name}</td>
                            <td>{pkg.slot_count}</td>
                            <td>{pkg.price}</td>
                            <td>
                                <Link to={`/packages/${pkg.id}/edit`}>Editar</Link>
                                <button onClick={() => handleDelete(pkg.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handleBack}>Volver</button>
        </div>
    );
};

export default PackagePage;