import React, { useState, useRef } from "react";
import { Pedido, Producto } from "../types/interfaces";
import { Toast } from "primereact/toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

interface PedidosProps {
    pedidos: Pedido[];
    productos: Producto[];
    setPedidos: React.Dispatch<React.SetStateAction<Pedido[]>>;
}

export const Pedidos: React.FC<PedidosProps> = ({ pedidos, productos, setPedidos }) => {
    const [pedido, setPedido] = useState<Pedido>({ id: 0, productos: [], total: 0 });
    const [dlgGuardar, setDlgGuardar] = useState<boolean>(false);
    const [dlgEliminar, setDlgEliminar] = useState<boolean>(false);
    const [pedidoSel, setPedidoSel] = useState<Pedido | null>(null);
    const toast = useRef<any>(null);

    const calcularTotal = (productosPedido: any[]) => {
        return productosPedido.reduce((total, item) => {
            const producto = productos.find(p => p.id === item.productoId);
            return total + (producto ? producto.precio * item.cantidad : 0);
        }, 0);
    };

    const guardarPedido = () => {
        if (pedido.id === 0) {
            const nuevoPedido = {
                ...pedido,
                id: pedidos.length + 1,
                total: calcularTotal(pedido.productos)
            };
            setPedidos([...pedidos, nuevoPedido]);
            toast.current.show({ severity: 'success', summary: 'Pedido guardado', detail: 'El pedido fue guardado correctamente' });
        } else {
            const pedidoActualizado = {
                ...pedido,
                total: calcularTotal(pedido.productos)
            };
            setPedidos(pedidos.map(p => (p.id === pedido.id ? pedidoActualizado : p)));
            toast.current.show({ severity: 'info', summary: 'Pedido actualizado', detail: 'El pedido fue actualizado correctamente' });
        }
        setDlgGuardar(false);
        setPedido({ id: 0, productos: [], total: 0 });
    };

    const editarPedido = (pedido: Pedido) => {
        setPedido(pedido);
        setDlgGuardar(true);
    };

    const confirmarEliminacion = (pedido: Pedido) => {
        setPedidoSel(pedido);
        setDlgEliminar(true);
    };

    const eliminarPedido = () => {
        setPedidos(pedidos.filter(p => p.id !== pedidoSel?.id));
        setDlgEliminar(false);
        toast.current.show({ severity: 'success', summary: 'Pedido eliminado', detail: 'El pedido fue eliminado correctamente' });
    };

    return (
        <div>
            <Toast ref={toast} />
            <h1>Gestión de Pedidos</h1>
            <h1>Pulse el boton NUEVO para realizar su pedido</h1>
            <Button label="Nuevo Pedido"
                icon="pi pi-plus"
                onClick={() => setDlgGuardar(true)} 
            />
            <DataTable value={pedidos}
                selectionMode="single"
                onRowSelect={e => editarPedido(e.data)}>
                <Column field="id" header="ID Pedido" />
                <Column field="productos" header="Productos"
                    body={(rowData) => rowData.productos.map((p: any) => {
                        const producto = productos.find(prod => prod.id === p.productoId);
                        return `${p.cantidad}x ${producto?.nombre || ''} ($${producto?.precio || 0})`;
                    }).join(', ')}
                />
                <Column field="total" header="Total ($)" />
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

            <Dialog header="Nuevo Pedido"
                visible={dlgGuardar}
                onHide={() => setDlgGuardar(false)}>
                <div className="p-field">
                    <label htmlFor="productos">Productos:</label>
                    {pedido.productos.map((prod, index) => (
                        <div key={index} className="p-field p-grid">
                            <Dropdown
                                id={`producto${index}`}
                                value={prod.productoId}
                                options={productos}
                                optionLabel="nombre"
                                optionValue="id"
                                placeholder="Seleccione un producto"
                                onChange={(e) => {
                                    const nuevosProductos = [...pedido.productos];
                                    nuevosProductos[index].productoId = e.value;
                                    setPedido({ ...pedido, productos: nuevosProductos });
                                }}
                            />
                            <InputText
                                id={`cantidad${index}`}
                                value={prod.cantidad.toString()} // Convert the value to a string
                                onChange={(e) => {
                                    const nuevosProductos = [...pedido.productos];
                                    nuevosProductos[index].cantidad = parseInt(e.target.value, 10);
                                    setPedido({ ...pedido, productos: nuevosProductos });
                                }}
                            />
                            <span>${productos.find(p => p.id === prod.productoId)?.precio || 0}</span>
                            <Button
                                icon="pi pi-trash"
                                className="p-button-danger"
                                onClick={() => {
                                    const nuevosProductos = pedido.productos.filter((_, i) => i !== index);
                                    setPedido({ ...pedido, productos: nuevosProductos });
                                }}
                            />
                        </div>
                    ))}
                    <Button
                        label="Agregar Producto"
                        icon="pi pi-plus"
                        onClick={() => setPedido({ ...pedido, productos: [...pedido.productos, { productoId: 0, cantidad: 1 }] })}
                    />
                </div>
                <Button label="Guardar"
                    icon="pi pi-save"
                    onClick={guardarPedido}
                />
            </Dialog>

            <Dialog
                header="Eliminar Pedido"
                visible={dlgEliminar}
                onHide={() => setDlgEliminar(false)}>
                <p>¿Está seguro que desea eliminar el pedido #{pedidoSel?.id}?</p>
                <Button label="Sí" icon="pi pi-check" onClick={eliminarPedido} /> <br />
                <Button label="No" icon="pi pi-times" onClick={() => setDlgEliminar(false)} />
            </Dialog>
        </div>
    );
}
