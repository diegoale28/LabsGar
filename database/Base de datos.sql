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
    precio DECIMAL NOT NULL CHECK (precio >= 0),
    duracion_estimada INT,
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
    -- costo_unitario DECIMAL NOT NULL CHECK (costo_unitario >= 0),
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
    estado ENUM('pendiente', 'procesando', 'completado', 'cancelado') DEFAULT 'pendiente',
    observaciones TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli) ON DELETE CASCADE,
    FOREIGN KEY (id_usu) REFERENCES usuarios(id_usu) ON DELETE RESTRICT,
    INDEX idx_cliente (id_cli),
    INDEX idx_usuario (id_usu),
    INDEX idx_numero_orden (numero_orden)
);

CREATE TABLE orden_detalle (
    id_detalle VARCHAR(50) PRIMARY KEY,
    id_orden VARCHAR(50) NOT NULL,
    id_examen VARCHAR(50) NOT NULL,
    precio DECIMAL NOT NULL CHECK (precio >= 0),
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_examen) REFERENCES examen(id_examen) ON DELETE RESTRICT,
    INDEX idx_orden (id_orden),
    INDEX idx_examen (id_examen)
);

-- Tabla de resultados
CREATE TABLE resultados (
    id_res VARCHAR(50) PRIMARY KEY,
    id_orden VARCHAR(50) NOT NULL,
    resultado TEXT NOT NULL,
    interpretacion TEXT,
    id_medico VARCHAR(50) NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE CASCADE,
    FOREIGN KEY (id_medico) REFERENCES medicos(id_medico) ON DELETE RESTRICT,
    UNIQUE KEY uk_orden_resultado (id_orden),
    INDEX idx_medico_resultado (id_medico)
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
    subtotal DECIMAL NOT NULL CHECK (subtotal >= 0),
    iva DECIMAL NOT NULL CHECK (iva >= 0),
    total DECIMAL NOT NULL CHECK (total >= 0),
    metodo_pago ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'mixto') NOT NULL,
    FOREIGN KEY (id_cli) REFERENCES clientes(id_cli) ON DELETE RESTRICT,
    FOREIGN KEY (id_orden) REFERENCES orden(id_orden) ON DELETE RESTRICT,
    UNIQUE KEY uk_orden_venta (id_orden),
    INDEX idx_cliente_fecha (id_cli, fecha_emision),
    INDEX idx_numero_factura (numero_factura)
);

INSERT INTO rol (id_rol, rol) VALUES ('1', 'ADMIN'), ('2', 'Enfermero/Enfermera');

INSERT INTO usuarios (id_usu, nombre, apellido, rol, usuario, clave) VALUES ('1', 'Admin', 'Admin', '1', 'admin', '1234'), ('2', 'Enfermero', 'Enfermero', '2', 'Enfermero', '1234');

INSERT INTO usuarios (id_usu, nombre, apellido, rol, usuario, clave)
VALUES 
('USU-01', 'Andrés', 'Salazar', 2, 'asalazar_enfer', 'Clave.2026*'),
('USU-02', 'Beatriz', 'Luna', 2, 'bluna_lab', 'Segura_987'),
('USU-03', 'Ricardo', 'Peña', 2, 'rpena_salud', 'Ricar_2024!'),
('USU-04', 'Mariana', 'Vivas', 2, 'mvivas_enfer', 'Mv_Bio2025'),
('USU-05', 'Jorge', 'Campos', 2, 'jcampos_med', 'J_campos88'),
('USU-06', 'Carmen', 'Ortiz', 2, 'cortiz_enf', 'Enf.2026_C'),
('USU-07', 'Francisco', 'Lugo', 2, 'flugo_lab', 'Lab_Pass77'),
('USU-08', 'Paola', 'Duarte', 2, 'pduarte_enf', 'Pao_Clinic21'),
('USU-09', 'Roberto', 'Sanz', 2, 'rsanz_bio', 'Bio_Sanz99'),
('USU-10', 'Julia', 'Torres', 2, 'jtorres_enf', 'Juli_Enf2026');

INSERT INTO insumos (id_insumo, codigo, nombre, unidad_medida)
VALUES 
('INS-001', 'TUB-01-VLT', 'Tubo de ensayo con EDTA 4ml (Tapa morada)', 'Unidad'),
('INS-002', 'AGU-21-GRN', 'Aguja hipodérmica 21G x 1 1/2', 'Unidad'),
('INS-003', 'ALC-70-LTR', 'Alcohol isopropílico al 70%', 'Litro'),
('INS-004', 'GUA-LAT-MED', 'Guantes de látex talla M (Caja x 100)', 'Caja'),
('INS-005', 'REA-GLU-01', 'Reactivo para prueba de glucosa enzimática', 'Kit'),
('INS-006', 'TUB-02-RED', 'Tubo de ensayo seco (Tapa roja)', 'Unidad'),
('INS-007', 'TUB-03-BLU', 'Tubo de ensayo con Citrato (Tapa azul)', 'Unidad'),
('INS-008', 'RECI-OR-01', 'Recolector de orina estéril 60ml', 'Unidad'),
('INS-009', 'TIRA-REAC-10', 'Tiras reactivas para orina (10 parámetros)', 'Unidad'),
('INS-010', 'TOR-ALC-01', 'Torunda de algodón precargada con alcohol', 'Unidad');

INSERT INTO examen (id_examen, nombre, codigo, descripcion, precio, duracion_estimada, requiere_ayuno, instrucciones_preparacion)
VALUES 
('EX-001', 'Hemograma Completo', 'HEM-01', 'Análisis detallado de glóbulos rojos, blancos y plaquetas.', 25.00, '00:15:00', TRUE, 'No realizar ejercicio intenso 24h antes.'),
('EX-002', 'Perfil Lipídico', 'LIP-02', 'Medición de colesterol total, HDL, LDL y triglicéridos.', 35.50, '00:10:00', TRUE, 'Ayuno estricto de 12 horas.'),
('EX-003', 'Glucosa en Ayunas', 'GLU-03', 'Medición de niveles de azúcar en sangre.', 15.00, '00:05:00', TRUE, 'Ayuno de 8 a 10 horas.'),
('EX-004', 'Examen General de Orina', 'EGO-04', 'Análisis físico, químico y microscópico de la orina.', 12.00, '01:00:00', FALSE, 'Recolectar la primera orina de la mañana.'),
('EX-005', 'Tiempo de Protrombina (PT)', 'COA-05', 'Evaluación de los factores de coagulación.', 18.00, '00:20:00', TRUE, 'Ayuno de 4 a 6 horas.'),
('EX-006', 'Perfil Tiroideo T3 T4 TSH', 'END-06', 'Evaluación de la función de la glándula tiroides.', 55.00, '00:15:00', TRUE, 'Asistir sin haber tomado medicamento tiroideo.');

INSERT INTO insumos_utilizados (id_insumo_utilizado, id_examen, id_insumo, cantidad_insumo)
VALUES 
('IU-001', 'EX-001', 'INS-001', 1),
('IU-002', 'EX-001', 'INS-002', 1), 
('IU-003', 'EX-001', 'INS-005', 1), 
('IU-004', 'EX-002', 'INS-001', 1), 
('IU-005', 'EX-002', 'INS-002', 1),
('IU-006', 'EX-002', 'INS-004', 2), 
('IU-007', 'EX-003', 'INS-002', 1), 
('IU-008', 'EX-003', 'INS-003', 2),
('IU-009', 'EX-004', 'INS-008', 1), -- Recolector
('IU-010', 'EX-004', 'INS-009', 1), -- Tira reactiva
('IU-011', 'EX-004', 'INS-004', 1), -- 1 guante (parcial)

-- Insumos para Tiempo de Protrombina (EX-005)
('IU-012', 'EX-005', 'INS-007', 1), -- Tubo azul
('IU-013', 'EX-005', 'INS-002', 1), -- Aguja
('IU-014', 'EX-005', 'INS-010', 1), -- Torunda alcohol

-- Insumos para Perfil Tiroideo (EX-006)
('IU-015', 'EX-006', 'INS-006', 1), -- Tubo rojo
('IU-016', 'EX-006', 'INS-002', 1), -- Aguja
('IU-017', 'EX-006', 'INS-010', 2); -- 2 Torundas

INSERT INTO clientes (id_cli, nombre, apellido, cedula, telefono, genero, direccion)
VALUES 
('CLI-001', 'Carlos', 'Mendoza', 'V-12.345.678', '0414-1234567', 'M', 'Calle 5 con Av. 10, Edif. Los Andes, Apto 4B'),
('CLI-002', 'Elena', 'Rodríguez', 'V-15.987.654', '0424-7654321', 'F', 'Urbanización La Floresta, Vereda 12, Casa 45'),
('CLI-003', 'Miguel', 'García', 'V-20.111.222', '0412-5550011', 'M', 'Av. Bolívar, Residencias El Trapiche, Torre A'),
('CLI-004', 'Lucía', 'Fernández', 'V-18.444.555', '0416-8889900', 'F', 'Sector Las Acacias, Calle Principal Nro 10-20'),
('CLI-005', 'Dorian', 'Pérez', 'V-25.666.777', '0414-0001122', 'Otro', 'Casco Central, Calle Real, Local 5'),
('CLI-006', 'Rosa', 'Márquez', 'V-9.555.444', '0424-1112233', 'F', 'Pueblo Nuevo, Calle 2, Nro 5'),
('CLI-007', 'Jose', 'Bracho', 'V-22.333.444', '0412-9998877', 'M', 'Barrio Obrero, Carrera 15'),
('CLI-008', 'Diana', 'Useche', 'V-19.888.777', '0414-4445566', 'F', 'Residencias Los Pinos, Torre B');

INSERT INTO medicos (id_medico, nombre, apellido, especialidad, telefono, direccion)
VALUES 
('MED-001', 'Humberto', 'Ramírez', 'Medicina Interna', '0414-7778899', 'Centro Médico Profesional, Consultorio 12'),
('MED-002', 'Silvia', 'Kaufman', 'Endocrinología', '0424-5554433', 'Policlínica Metropolitana, Planta Baja, Local 5'),
('MED-003', 'Francisco', 'Tavera', 'Hematología', '0412-1112222', 'Unidad Médica Las Acacias, Consultorio 204'),
('MED-004', 'Adriana', 'Soto', 'Ginecología y Obstetricia', '0416-3334455', 'Av. Intercomunal, Torre de Especialidades Médicas'),
('MED-005', 'Marcos', 'Paredes', 'Cardiología', '0424-9990011', 'Hospital Central, Ala Norte, Consultorio 15'),
('MED-006', 'Valeria', 'Gómez', 'Urología', '0414-2223344', 'Centro Clínico San José, Piso 2, Ofic. 22'),
('MED-007', 'Leonardo', 'Vargas', 'Pediatría', '0412-8887766', 'Residencias Médicas El Parque, PB Local 2');

INSERT INTO orden (id_orden, id_cli, id_usu, estado, observaciones, fecha)
VALUES 
('ORD-001', 'CLI-001', 'USU-01', 'pendiente', 'Paciente refiere ayuno de 10 horas.', '2026-02-10 08:30:00'),
('ORD-002', 'CLI-002', 'USU-08', 'pendiente', 'Urgente: enviar resultados por correo.', '2026-02-11 09:15:00'),
('ORD-003', 'CLI-006', 'USU-04', 'pendiente', 'Muestra de orina traída desde casa.', '2026-02-12 07:45:00'),
('ORD-004', 'CLI-003', 'USU-01', 'pendiente', 'Paciente no cumplió con el ayuno requerido.', '2026-02-12 10:00:00'),
('ORD-005', 'CLI-004', 'USU-09', 'pendiente', 'Control de rutina mensual.', '2026-02-12 11:30:00');


INSERT INTO orden_detalle (id_detalle, id_orden, id_examen, precio)
VALUES 
-- Detalle para la Orden 1 (Hemograma + Glucosa)
('DET-001', 'ORD-001', 'EX-001', 25.00),
('DET-002', 'ORD-001', 'EX-003', 15.00),

-- Detalle para la Orden 2 (Perfil Lipídico)
('DET-003', 'ORD-002', 'EX-002', 35.50),

-- Detalle para la Orden 3 (Examen de Orina)
('DET-004', 'ORD-003', 'EX-004', 12.00),

-- Detalle para la Orden 5 (Perfil Tiroideo)
('DET-005', 'ORD-005', 'EX-006', 55.00);