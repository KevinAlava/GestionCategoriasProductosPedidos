import React, { useState, useRef } from "react";
import { Producto, Categoria } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

interface ProductosProps {
    productos: Producto[];
    categorias: Categoria[];
    setProductos: React.Dispatch<React.SetStateAction<Producto[]>>;
}

export const Productos: React.FC<ProductosProps> = ({ productos, categorias, setProductos }) => {
    const [producto, setProducto] = useState<Producto>({ id: 0, nombre: '', categoriaId: 0, precio: 0 });
    const [dlgGuardar, setDlgGuardar] = useState<boolean>(false);
    const [dlgEliminar, setDlgEliminar] = useState<boolean>(false);
    const [productoSel, setProductoSel] = useState<Producto | null>(null);
    const toast = useRef<any>(null); // Declare the 'toast' variable

    const guardarProducto = () => {
        if (producto.id === 0) {
            setProductos([...productos, { ...producto, id: productos.length + 1 }]);
            toast.current.show({ severity: 'success', summary: 'success', detail: 'Producto guardado' });
        } else {
            setProductos(productos.map(p => (p.id === producto.id ? producto : p)));
            toast.current.show({ severity: 'info', summary: 'info', detail: 'Producto actualizado' });
        }
        setDlgGuardar(false);
        setProducto({ id: 0, nombre: '', categoriaId: 0, precio: 0 });
    }

    const editarProducto = (producto: Producto) => {
        setProducto(producto);
        setDlgGuardar(true);
    }

    const confirmarEliminacion = (producto: Producto) => {
        setProductoSel(producto);
        setDlgEliminar(true);
    }

    const eliminarProducto = () => {
        setProductos(productos.filter(p => p.id !== productoSel?.id));
        setDlgEliminar(false);
        toast.current.show({ severity: 'success', summary: 'Información', detail: 'Producto eliminado' });
    }

    return (
        <div>
            <Toast ref={toast}/>
            <h1>Gestión de Productos</h1>
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={() => setDlgGuardar(true)} />
            <DataTable value={productos}
                selectionMode="single"
                onRowSelect={e => editarProducto(e.data)}>
                <Column field="id" header="Id" />
                <Column field="nombre" header="Nombre" />
                <Column field="categoriaId" header="Categoría"
                    body={(rowData) => {
                        const categoria = categorias.find(c => c.id === rowData.categoriaId);
                        return categoria ? categoria.nombre : '';
                    }}
                />
                <Column
                    body={rowData =>
                        <Button
                            label="Eliminar"
                            icon="pi pi-trash"
                            onClick={() => confirmarEliminacion(rowData)}
                        />
                    }
                />
            </DataTable>

            <Dialog header="Nuevo Producto"
                visible={dlgGuardar}
                onHide={() => setDlgGuardar(false)}>
                <div className="p-field">
                    <label htmlFor="txtNombre">Nombre</label>
                    <InputText
                        id="txtNombre"
                        value={producto.nombre}
                        onChange={(e) => setProducto({ ...producto, nombre: e.target.value })}
                    />
                </div>
                <div className="p-field">
                    <label htmlFor="categoria">Categoría:</label>
                    <Dropdown
                        id="categoria"
                        value={producto.categoriaId}
                        options={categorias}
                        optionLabel="nombre"
                        optionValue="id"
                        placeholder="Seleccione una categoría"
                        onChange={(e) => setProducto({ ...producto, categoriaId: e.value })}
                    />
                </div>
                <Button label="Guardar"
                    icon="pi pi-save"
                    onClick={guardarProducto}
                />
            </Dialog>

            <Dialog
                header="Eliminar"
                visible={dlgEliminar}
                onHide={() => setDlgEliminar(false)}>
                <p>¿Está seguro que desea eliminar el producto {productoSel?.nombre}?</p>
                <Button label="Sí" icon="pi pi-check" onClick={eliminarProducto} />
                <Button label="No" icon="pi pi-times" onClick={() => setDlgEliminar(false)} />
            </Dialog>

        </div>
    );
}