import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Inicio } from './components/Inicio';
import { Productos } from './components/Productos'; // Componente para productos
import { Categorias } from './components/Categoria'; // Componente para categorías
import { Pedidos } from './components/Pedidos'; // Componente para pedidos
import { Categoria, Producto, Pedido } from './types/interfaces'; // Interfaces de Categoría, Producto y Pedido

const App: React.FC = () => {

  // Estado para Categorías
  const [categorias, setCategorias] = useState<Categoria[]>([
    { id: 1, nombre: 'Tecnología' },
    { id: 2, nombre: 'Ropa' },
    { id: 3, nombre: 'Legumbres' },
    { id: 4, nombre: 'Frutas' },
  ]);

  // Estado para Productos
  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, nombre: 'Laptop', categoriaId: 1, precio: 999.99 },
    { id: 2, nombre: 'Camiseta', categoriaId: 2, precio: 19.99 },
    { id: 3, nombre: 'Mouse', categoriaId: 1, precio: 9.99 },
    { id: 4, nombre: 'Pantalón', categoriaId: 2, precio: 29.99 },
    { id: 5, nombre: 'Tomate', categoriaId: 3, precio: 1.99 },
    { id: 6, nombre: 'Manzana', categoriaId: 4, precio: 0.99 },
    { id: 7, nombre: 'Teclado', categoriaId: 1, precio: 19.99 },
    { id: 8, nombre: 'Zapatos', categoriaId: 2, precio: 39.99 },
  ]);

  // Estado para Pedidos
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/categoria" element={<Categorias categorias={categorias} setCategorias={setCategorias} />} />
        <Route path="/productos" element={<Productos categorias={categorias} productos={productos} setProductos={setProductos} />} />
        <Route path="/pedidos" element={<Pedidos productos={productos} pedidos={pedidos} setPedidos={setPedidos} />} />
      </Routes>
    </Router>
  );
}

export default App;
