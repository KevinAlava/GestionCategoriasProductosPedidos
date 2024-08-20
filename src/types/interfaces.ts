export interface Categoria {
    id: number;
    nombre: string;
}

export interface Producto {
    id: number;
    nombre: string;
    categoriaId: number;
    precio: number;
}

export interface ProductoPedido {
    productoId: number;
    cantidad: number;
}

export interface Pedido {
    id: number;
    productos: ProductoPedido[];
    total: number;
}
