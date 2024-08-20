import React, { useRef, useState } from "react";
import { Categoria } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";

interface CategoriasProps {
    categorias: Categoria[];
    setCategorias: React.Dispatch<React.SetStateAction<Categoria[]>>;
}

export const Categorias: React.FC<CategoriasProps> = ({ categorias, setCategorias }) => {
    const [categoria, setCategoria] = useState<Categoria>({ id: 0, nombre: ''});
    const [dlgGuardar, setDlgGuardar] = useState<boolean>(false);
    const [dlgEliminar, setDlgEliminar] = useState<boolean>(false);
    const [categoriaSel, setCategoriaSel] = useState<Categoria | null>(null);
    const toast = useRef<any>(null); // Declare the toast variable

    const guardarCategoria = () => {
        if (categoria.id === 0) {
            setCategorias([...categorias, { ...categoria, id: categorias.length + 1 }]);
            toast.current.show({ severity: 'success', summary: 'success', detail: 'Categoría guardada' });
        } else {
            setCategorias(categorias.map(c => (c.id === categoria.id ? categoria : c)));
            toast.current.show({ severity: 'info', summary: 'info', detail: 'Categoría actualizada' });
        }
        setDlgGuardar(false);
        setCategoria({ id: 0, nombre: '' });
    }

    const editarCategoria = (categoria: Categoria) => {
        setCategoria(categoria);
        setDlgGuardar(true);
    }

    const confirmarEliminacion = (categoria: Categoria) => {
        setCategoriaSel(categoria);
        setDlgEliminar(true);
    }

    const eliminarCategoria = () => {
        setCategorias(categorias.filter(c => c.id !== categoriaSel?.id));
        setDlgEliminar(false);
        toast.current.show({ severity: 'info', summary: 'Info', detail: 'Categoría eliminada' });
    }

    return (
        <div>
            <Toast ref={toast} />
            <h1>Gestión de Categorías</h1>
            <Button label="Nuevo"
                icon="pi pi-plus"
                onClick={() => setDlgGuardar(true)} />
            <DataTable value={categorias}
                selectionMode="single"
                onRowSelect={e => editarCategoria(e.data)}>
                <Column field="id" header="Id" />
                <Column field="nombre" header="Nombre" />
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

            <Dialog header="Nueva Categoría"
                visible={dlgGuardar}
                onHide={() => setDlgGuardar(false)}>
                <div className="p-field">
                    <label htmlFor="txtNombre">Nombre</label>
                    <InputText
                        id="txtNombre"
                        value={categoria.nombre}
                        onChange={(e) => setCategoria({ ...categoria, nombre: e.target.value })}
                    />
                </div>
                <Button label="Guardar"
                    icon="pi pi-save"
                    onClick={guardarCategoria}
                />
            </Dialog>

            <Dialog
                header="Eliminar"
                visible={dlgEliminar}
                onHide={() => setDlgEliminar(false)}>
                <p>¿Está seguro que desea eliminar la categoría {categoriaSel?.nombre}?</p>
                <Button label="Sí"
                    icon="pi pi-check"
                    onClick={eliminarCategoria}
                />
                <Button label="No"
                    icon="pi pi-times"
                    onClick={() => setDlgEliminar(false)}
                />
            </Dialog>
        </div>
    )
}