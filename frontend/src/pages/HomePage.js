import React from "react";

const HomePage = () => {
    return (
        <div style={styles.container}>
            <h1>Bienvenid@ a Pilates Verónica Studio</h1>
            <p>Administra clientes, sesiones y paquetes con facilidad.</p>
            
            <h2>📌 ¿Qué puedes hacer aquí?</h2>
            <p>📋 Gestionar la lista de clientes y sus datos.</p>
            <p>📅 Agendar y administrar sesiones de Pilates.</p>
            <p>🎟️ Manejar los paquetes de clases disponibles.</p>

            <h2>📝 Instrucciones</h2>
            <p>
                Usa la barra de navegación de arriba para acceder a las diferentes secciones.
                Desde ahí puedes crear, editar y eliminar clientes, sesiones y paquetes.
            </p>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        marginTop: "20px",
    },
};

export default HomePage;
