-- Crear Base de Datos
CREATE DATABASE IF NOT EXISTS six_pack_store;
USE six_pack_store;

-- Tabla: Categorías
CREATE TABLE categorias (
    ID_Categoria INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Descripcion TEXT,
    Activo BOOLEAN DEFAULT TRUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: Productos
CREATE TABLE productos (
    ID_Producto INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(150) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10,2) NOT NULL,
    ID_Categoria INT,
    Stock INT DEFAULT 0,
    Imagen_URL VARCHAR(255),
    Tipo_Presentacion VARCHAR(50),
    Volumen VARCHAR(50),
    Grados_Alcohol DECIMAL(3,1),
    Marca VARCHAR(100),
    Activo BOOLEAN DEFAULT TRUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ID_Categoria) REFERENCES categorias(ID_Categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: Clientes
CREATE TABLE clientes (
    ID_Cliente INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Telefono VARCHAR(15) NOT NULL UNIQUE,
    Email VARCHAR(100),
    Direccion TEXT,
    Colonia VARCHAR(100),
    Ciudad VARCHAR(100),
    Codigo_Postal VARCHAR(10),
    Fecha_Registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: Pedidos
CREATE TABLE pedidos (
    ID_Pedido INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cliente INT,
    Total DECIMAL(10,2) NOT NULL,
    Estado VARCHAR(50) DEFAULT 'Pendiente',
    Tipo_Entrega VARCHAR(50) DEFAULT 'Domicilio',
    Fecha_Pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Notas TEXT,
    FOREIGN KEY (ID_Cliente) REFERENCES clientes(ID_Cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: Detalle Pedidos
CREATE TABLE detalle_pedidos (
    ID_Detalle INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT NOT NULL,
    ID_Producto INT NOT NULL,
    Cantidad INT NOT NULL,
    Precio_Unitario DECIMAL(10,2) NOT NULL,
    Subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (ID_Pedido) REFERENCES pedidos(ID_Pedido),
    FOREIGN KEY (ID_Producto) REFERENCES productos(ID_Producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: Usuarios
CREATE TABLE usuarios (
    ID_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Usuario VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Nombre_Completo VARCHAR(100),
    Rol VARCHAR(30) DEFAULT 'empleado',
    Activo BOOLEAN DEFAULT TRUE,
    Fecha_Creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- INSERTAR DATOS DE PRUEBA
-- ============================================

-- Categorías
INSERT INTO categorias (Nombre, Descripcion) VALUES
('Cerveza Nacional', 'Cervezas producidas en México'),
('Cerveza Importada', 'Cervezas internacionales'),
('Cerveza Artesanal', 'Cervezas artesanales de calidad'),
('Promociones', 'Ofertas especiales');

-- Productos (12)
INSERT INTO productos (Nombre, Descripcion, Precio, ID_Categoria, Stock, Tipo_Presentacion, Volumen, Grados_Alcohol, Marca, Imagen_URL) VALUES
('Corona Extra Six Pack', 'Six pack de cerveza Corona Extra, refrescante y ligera', 89.00, 1, 50, 'Six Pack', '355ml', 4.6, 'Corona', 'corona-six.jpg'),
('Modelo Special Six Pack', 'Six pack de cerveza Modelo Special, sabor único', 95.00, 1, 45, 'Six Pack', '355ml', 4.4, 'Modelo', 'modelo-six.jpg'),
('Victoria Six Pack', 'Six pack de cerveza Victoria, ideal para acompañar', 82.00, 1, 40, 'Six Pack', '355ml', 4.0, 'Victoria', 'victoria-six.jpg'),
('Indio Six Pack', 'Six pack de cerveza Indio, carácter mexicano', 78.00, 1, 35, 'Six Pack', '355ml', 3.6, 'Indio', 'indio-six.jpg'),
('Tecate Light Six Pack', 'Six pack de cerveza Tecate Light, baja en calorías', 88.00, 1, 30, 'Six Pack', '355ml', 3.5, 'Tecate', 'tecate-light-six.jpg'),
('Heineken Six Pack', 'Six pack de cerveza Heineken, excelente calidad', 110.00, 2, 30, 'Six Pack', '355ml', 5.0, 'Heineken', 'heineken-six.jpg'),
('Stella Artois Six Pack', 'Six pack de cerveza Stella Artois, sofisticada', 120.00, 2, 25, 'Six Pack', '355ml', 5.2, 'Stella Artois', 'stella-artois-six.jpg'),
('Budweiser Six Pack', 'Six pack de cerveza Budweiser, clásica americana', 105.00, 2, 28, 'Six Pack', '355ml', 5.0, 'Budweiser', 'budweiser-six.jpg'),
('Miller Lite Six Pack', 'Six pack de cerveza Miller Lite, ligera y refrescante', 98.00, 2, 32, 'Six Pack', '355ml', 4.2, 'Miller', 'miller-lite-six.jpg'),
('Minerva Six Pack', 'Six pack de cerveza artesanal Minerva, sabor único', 150.00, 3, 20, 'Six Pack', '355ml', 6.0, 'Minerva', 'minerva-six.jpg'),
('Cucapá Six Pack', 'Six pack de cerveza artesanal Cucapá de Baja California', 145.00, 3, 18, 'Six Pack', '355ml', 5.8, 'Cucapá', 'cucapa-six.jpg'),
('Primus Six Pack', 'Six pack de cerveza artesanal Primus con lúpulos selectos', 155.00, 3, 15, 'Six Pack', '355ml', 6.2, 'Primus', 'primus-six.jpg');

-- Usuarios (Admin)
INSERT INTO usuarios (Usuario, Password, Nombre_Completo, Rol) VALUES
('admin', 'admin123', 'Administrador', 'admin');

-- Clientes de prueba
INSERT INTO clientes (Nombre, Telefono, Email, Direccion, Colonia, Ciudad, Codigo_Postal) VALUES
('Juan Pérez', '6461234567', 'juan.perez@email.com', 'Calle Principal 123', 'Centro', 'Hermosillo', '83000'),
('María García', '6469876543', 'maria.garcia@email.com', 'Avenida Secundaria 456', 'Zona Hotelera', 'Hermosillo', '83100');

-- Pedidos de prueba
INSERT INTO pedidos (ID_Cliente, Total, Estado, Tipo_Entrega, Notas) VALUES
(1, 274.00, 'Entregado', 'Domicilio', 'Tocar el timbre al llegar'),
(2, 220.00, 'Confirmado', 'Recoger en tienda', 'Listo para recoger');

-- Detalle de pedidos
INSERT INTO detalle_pedidos (ID_Pedido, ID_Producto, Cantidad, Precio_Unitario, Subtotal) VALUES
(1, 1, 2, 89.00, 178.00),
(1, 5, 1, 88.00, 88.00),
(2, 6, 2, 110.00, 220.00);
