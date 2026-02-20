-- Tabla de roles
CREATE TABLE rol (
    id_rol VARCHAR(50) PRIMARY KEY,
    rol VARCHAR(100) NOT NULL,
    UNIQUE KEY uk_rol (rol)
);

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usu VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    usuario VARCHAR(100) NOT NULL,
    clave VARCHAR(300) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login TIMESTAMP NULL,
    FOREIGN KEY (rol) REFERENCES rol(id_rol) ON DELETE RESTRICT,
    UNIQUE KEY uk_usuario (usuario),
    INDEX idx_rol (rol),
    INDEX idx_activo (activo)
);

-- Tabla de médicos
CREATE TABLE medicos (
    id_medico VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad VARCHAR(100),
    telefono VARCHAR(20),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre_completo (nombre, apellido)
);

-- Tabla de clientes/pacientes
CREATE TABLE clientes (
    id_cli VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    telefono VARCHAR(20),
    genero ENUM('M', 'F', 'Otro'),
    direccion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_cedula (cedula),
    INDEX idx_nombre_cliente (nombre, apellido)
);

-- Tabla de exámenes/tests
CREATE TABLE examen (
    id_examen VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(300) NOT NULL,
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0),
    duracion_estimada INT COMMENT 'Minutos',
    requiere_ayuno BOOLEAN DEFAULT FALSE,
    instrucciones_preparacion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_codigo_examen (codigo),
    INDEX idx_activo_examen (activo),
    INDEX idx_precio (precio)
);

-- Tabla de insumos
CREATE TABLE insumos (
    id_insumo VARCHAR(50) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(300) NOT NULL,
    costo_unitario DECIMAL(10,2) NOT NULL CHECK (costo_unitario >= 0),
    unidad_medida VARCHAR(20) NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_codigo_insumo (codigo)
);

-- Tabla de órdenes/exámenes solicitados
CREATE TABLE orden (
    id_orden VARCHAR(50) PRIMARY KEY,
    numero_orden INT AUTO_INCREMENT UNIQUE KEY,
    id_cli VARCHAR(50) NOT NULL,
    id_usu VARCHAR(50) NOT NULL,
    id_examen VARCHAR(50) NOT NULL,
    estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli) ON DELETE CASCADE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu) ON DELETE RESTRICT,
    FOREIGN KEY (id_examen) REFERENCES examen(id_examen) ON DELETE RESTRICT,
    INDEX idx_cliente (id_cli),
    INDEX idx_usuario (id_usu),
    INDEX idx_examen (id_examen),
    INDEX idx_numero_orden (numero_orden)
);

-- Tabla de resultados
CREATE TABLE resultados (
    id_res VARCHAR(50) PRIMARY KEY,
    id_orden VARCHAR(50) NOT NULL,
    resultado TEXT NOT NULL,
    interpretacion TEXT,
    fecha DATETIME,
    estado ENUM('pendiente', 'procesado', 'validado', 'entregado') DEFAULT 'pendiente',
    observaciones TEXT,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE CASCADE,
    UNIQUE KEY uk_orden_resultado (id_orden),
    INDEX idx_estado_resultado (estado)
);

-- Tabla de insumos utilizados por examen
CREATE TABLE insumos_utilizados (
    id_insumo_utilizado VARCHAR(50) PRIMARY KEY,
    id_examen VARCHAR(50) NOT NULL,
    id_insumo VARCHAR(50) NOT NULL,
    cantidad_insumo INT NOT NULL CHECK (cantidad_insumo > 0),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_examen) REFERENCES examen(id_examen) ON DELETE CASCADE,
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo) ON DELETE RESTRICT,
    UNIQUE KEY uk_examen_insumo (id_examen, id_insumo)
);

-- Tabla de historia clínica
CREATE TABLE historia (
    id_hist VARCHAR(50) PRIMARY KEY,
    id_cli VARCHAR(50) NOT NULL,
    id_orden VARCHAR(50) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usu_registra VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli) ON DELETE CASCADE,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_usu_registra) REFERENCES usuarios(id_usu) ON DELETE RESTRICT,
    INDEX idx_cliente_fecha (id_cli, fecha),
    INDEX idx_orden (id_orden)
);

-- Tabla de ventas/facturación
CREATE TABLE ventas (
    id_ven VARCHAR(50) PRIMARY KEY,
    numero_factura INT AUTO_INCREMENT UNIQUE KEY,
    id_cli VARCHAR(50) NOT NULL,
    id_orden VARCHAR(50) NOT NULL,
    fecha_emision DATETIME DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL CHECK (subtotal >= 0),
    iva DECIMAL(10,2) NOT NULL CHECK (iva >= 0),
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    metodo_pago ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'mixto') NOT NULL,
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli) ON DELETE RESTRICT,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE RESTRICT,
    UNIQUE KEY uk_orden_venta (id_orden),
    INDEX idx_cliente_fecha (id_cli, fecha_emision),
    INDEX idx_numero_factura (numero_factura)
);
