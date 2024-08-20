import React from "react";
import './Inicio.css'; // Asegúrate de crear y enlazar este archivo CSS

export const Inicio: React.FC = () => {
    return (
        <div className="inicio-container">
            <div className="overlay">
                <h1>Inicio</h1>
                <p>Bienvenido a la aplicación de gestión de categorías y productos</p>
                <h3>Integrantes:</h3>
                <ul>
                    <li>Lizeth Quimi</li>
                    <li>Kevin Álava</li>
                </ul>
            </div>
        </div>
    );
};
