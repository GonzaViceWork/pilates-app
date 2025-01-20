import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div>
            <h1>Bienvenido a Pilates Verónica Studio</h1>
            <p>Administra clientes, sesiones y paquetes con facilidad.</p>
            <nav>
                <ul>
                    <li><Link to="/clients/">Gestión de Clientes</Link></li>
                    <li><Link to="/calendar/">Calendario</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default HomePage;
