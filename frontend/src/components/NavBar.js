import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
    return (
        <nav style={styles.navbar}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link to="/" style={styles.navLink}>🏠 Inicio</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/clients/" style={styles.navLink}>📋 Clientes</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/calendar/" style={styles.navLink}>📅 Calendario</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/packages/" style={styles.navLink}>🎟️ Paquetes</Link>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    navbar: {
        backgroundColor: "#333",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
    },
    navList: {
        listStyle: "none",
        display: "flex",
        gap: "20px",
        margin: 0,
        padding: 0,
    },
    navItem: {
        display: "inline",
    },
    navLink: {
        color: "white",
        textDecoration: "none",
        fontSize: "18px",
        fontWeight: "bold",
    },
};

export default NavBar;
