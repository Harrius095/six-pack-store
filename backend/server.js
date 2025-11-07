require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============= RUTAS DE PRODUCTOS =============

// GET: Obtener todos los productos activos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await query(`
            SELECT p.*, c.Nombre AS Categoria
            FROM productos p
            LEFT JOIN categorias c ON p.ID_Categoria = c.ID_Categoria
            WHERE p.Activo = TRUE
            ORDER BY p.ID_Producto DESC
        `);
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Obtener producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await query(`
            SELECT p.*, c.Nombre AS Categoria
            FROM productos p
            LEFT JOIN categorias c ON p.ID_Categoria = c.ID_Categoria
            WHERE p.ID_Producto = ? AND p.Activo = TRUE
        `, [req.params.id]);
        
        if (producto.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        
        res.json(producto[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Obtener productos por categoría
app.get('/api/productos/categoria/:id', async (req, res) => {
    try {
        const productos = await query(`
            SELECT p.*, c.Nombre AS Categoria
            FROM productos p
            LEFT JOIN categorias c ON p.ID_Categoria = c.ID_Categoria
            WHERE p.ID_Categoria = ? AND p.Activo = TRUE
            ORDER BY p.Nombre
        `, [req.params.id]);
        
        res.json(productos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST: Crear nuevo producto (Admin)
app.post('/api/productos', async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL } = req.body;
        
        const result = await query(`
            INSERT INTO productos (Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL]);
        
        res.status(201).json({ 
            success: true, 
            id: Number(result.insertId),
            message: 'Producto creado exitosamente' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Actualizar producto (Admin)
app.put('/api/productos/:id', async (req, res) => {
    try {
        const { Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL } = req.body;
        
        await query(`
            UPDATE productos 
            SET Nombre = ?, Descripcion = ?, Precio = ?, ID_Categoria = ?, 
                Stock = ?, Tipo_Presentacion = ?, Volumen = ?, Grados_Alcohol = ?, 
                Marca = ?, Imagen_URL = ?
            WHERE ID_Producto = ?
        `, [Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL, req.params.id]);
        
        res.json({ success: true, message: 'Producto actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Eliminar producto (soft delete)
app.delete('/api/productos/:id', async (req, res) => {
    try {
        await query('UPDATE productos SET Activo = FALSE WHERE ID_Producto = ?', [req.params.id]);
        res.json({ success: true, message: 'Producto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============= RUTAS DE CATEGORÍAS =============

// GET: Obtener todas las categorías
app.get('/api/categorias', async (req, res) => {
    try {
        const categorias = await query('SELECT * FROM categorias WHERE Activo = TRUE ORDER BY Nombre');
        res.json(categorias);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============= RUTAS DE PEDIDOS =============

// POST: Crear nuevo pedido
app.post('/api/pedidos', async (req, res) => {
    try {
        const { cliente, productos, total, notas, tipo_entrega } = req.body;
        
        // Insertar o buscar cliente
        let clienteId;
        const clienteExistente = await query('SELECT ID_Cliente FROM clientes WHERE Telefono = ?', [cliente.telefono]);
        
        if (clienteExistente.length > 0) {
            clienteId = clienteExistente[0].ID_Cliente;
            // Actualizar información del cliente
            await query(`
                UPDATE clientes 
                SET Nombre = ?, Email = ?, Direccion = ?, Colonia = ?, Ciudad = ?, Codigo_Postal = ?
                WHERE ID_Cliente = ?
            `, [cliente.nombre, cliente.email, cliente.direccion, cliente.colonia, cliente.ciudad, cliente.codigo_postal, clienteId]);
        } else {
            // Crear nuevo cliente
            const resultCliente = await query(`
                INSERT INTO clientes (Nombre, Telefono, Email, Direccion, Colonia, Ciudad, Codigo_Postal)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [cliente.nombre, cliente.telefono, cliente.email, cliente.direccion, cliente.colonia, cliente.ciudad, cliente.codigo_postal]);
            clienteId = Number(resultCliente.insertId);
        }
        
        // Crear pedido
        const resultPedido = await query(`
            INSERT INTO pedidos (ID_Cliente, Total, Estado, Tipo_Entrega, Notas)
            VALUES (?, ?, 'Pendiente', ?, ?)
        `, [clienteId, total, tipo_entrega, notas]);
        
        const pedidoId = Number(resultPedido.insertId);
        
        // Insertar detalle de productos
        for (const producto of productos) {
            await query(`
                INSERT INTO detalle_pedidos (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, Subtotal)
                VALUES (?, ?, ?, ?, ?)
            `, [pedidoId, producto.id, producto.cantidad, producto.precio, producto.cantidad * producto.precio]);
            
            // Actualizar stock
            await query('UPDATE productos SET Stock = Stock - ? WHERE ID_Producto = ?', [producto.cantidad, producto.id]);
        }
        
        res.status(201).json({ 
            success: true, 
            pedidoId: pedidoId,
            message: 'Pedido creado exitosamente' 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Obtener todos los pedidos (Admin)
app.get('/api/pedidos', async (req, res) => {
    try {
        const pedidos = await query(`
            SELECT p.*, c.Nombre AS Cliente, c.Telefono, c.Direccion
            FROM pedidos p
            JOIN clientes c ON p.ID_Cliente = c.ID_Cliente
            ORDER BY p.Fecha_Pedido DESC
        `);
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET: Obtener detalle de un pedido
app.get('/api/pedidos/:id', async (req, res) => {
    try {
        const pedido = await query(`
            SELECT p.*, c.Nombre AS Cliente, c.Telefono, c.Email, c.Direccion, c.Colonia, c.Ciudad
            FROM pedidos p
            JOIN clientes c ON p.ID_Cliente = c.ID_Cliente
            WHERE p.ID_Pedido = ?
        `, [req.params.id]);
        
        if (pedido.length === 0) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }
        
        const detalle = await query(`
            SELECT dp.*, pr.Nombre AS Producto, pr.Imagen_URL
            FROM detalle_pedidos dp
            JOIN productos pr ON dp.ID_Producto = pr.ID_Producto
            WHERE dp.ID_Pedido = ?
        `, [req.params.id]);
        
        res.json({
            pedido: pedido[0],
            detalle: detalle
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT: Actualizar estado del pedido (Admin)
app.put('/api/pedidos/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;
        await query('UPDATE pedidos SET Estado = ? WHERE ID_Pedido = ?', [estado, req.params.id]);
        res.json({ success: true, message: 'Estado actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============= RUTA DE PRUEBA =============

app.get('/', (req, res) => {
    res.json({ message: 'API Six Pack Store funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`🗄️  Base de datos: ${process.env.DB_NAME}`);
});
