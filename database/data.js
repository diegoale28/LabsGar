const clientes = [
  {
    id_cli: 101,
    nombre: "Carlos",
    apellido: "Rodríguez",
    cedula: "V-87654321"
  },
  {
    id_cli: 102,
    nombre: "Ana",
    apellido: "Martínez",
    cedula: "V-11223344"
  },
  {
    id_cli: 103,
    nombre: "Luis",
    apellido: "Pérez",
    cedula: "V-55667788"
  }
]

const examenesMedicos = [
  {
    id_examen: 501,
    codigo: "HEMO-001",
    descripcion: "Hemograma Completo con Plaquetas y Fórmula Leucocitaria",
    precio: 52.75,
    categoria: "Hematología",
    tipo_muestra: "Sangre venosa",
    tiempo_procesamiento: "2-4 horas",
    insumos_utilizados: [
      {
        id_insumo: 1001,
        nombre: "Tubo EDTA K2 4ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 3.15,
        lote: "EDTA-2024-156",
        caducidad: "2025-06-30"
      },
      {
        id_insumo: 1002,
        nombre: "Reactivo Hematológico (Diluyente)",
        cantidad: 4.2,
        unidad_medida: "ml",
        costo_unitario: 8.90,
        lote: "HEMA-2024-078",
        caducidad: "2024-12-15"
      }
    ]
  },
  {
    id_examen: 502,
    codigo: "HEPAT-002",
    descripcion: "Perfil Hepático Completo (6 elementos)",
    precio: 78.90,
    categoria: "Bioquímica",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "24 horas",
    requisitos_especiales: "Ayuno de 8 horas",
    insumos_utilizados: [
      {
        id_insumo: 2001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-089",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 2002,
        nombre: "Reactivo ALT (GPT)",
        cantidad: 1.8,
        unidad_medida: "ml",
        costo_unitario: 12.40,
        lote: "ALT-2024-045",
        caducidad: "2024-11-30"
      },
      {
        id_insumo: 2003,
        nombre: "Reactivo AST (GOT)",
        cantidad: 1.8,
        unidad_medida: "ml",
        costo_unitario: 11.90,
        lote: "AST-2024-039",
        caducidad: "2024-11-30"
      }
    ]
  },
  {
    id_examen: 503,
    codigo: "GLUC-003",
    descripcion: "Glucosa en Ayunas",
    precio: 28.50,
    categoria: "Bioquímica",
    tipo_muestra: "Plasma fluorurado",
    tiempo_procesamiento: "1-2 horas",
    requisitos_especiales: "Ayuno de 12 horas",
    insumos_utilizados: [
      {
        id_insumo: 3001,
        nombre: "Tubo Fluoruro 3ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.95,
        lote: "FLU-2024-112",
        caducidad: "2025-05-20"
      },
      {
        id_insumo: 3002,
        nombre: "Reactivo Glucosa Oxidasa",
        cantidad: 2.0,
        unidad_medida: "ml",
        costo_unitario: 6.80,
        lote: "GLU-2024-067",
        caducidad: "2024-10-15"
      }
    ]
  },
  {
    id_examen: 504,
    codigo: "URO-004",
    descripcion: "Urocultivo con Antibiograma",
    precio: 95.00,
    categoria: "Microbiología",
    tipo_muestra: "Orina",
    tiempo_procesamiento: "48-72 horas",
    insumos_utilizados: [
      {
        id_insumo: 4001,
        nombre: "Frasco estéril para orina",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 1.75,
        lote: "FRAS-2024-203",
        caducidad: "2026-01-31"
      },
      {
        id_insumo: 4002,
        nombre: "Agar Sangre",
        cantidad: 1,
        unidad_medida: "placa",
        costo_unitario: 4.25,
        lote: "AGAR-2024-091",
        caducidad: "2024-09-30"
      },
      {
        id_insumo: 4003,
        nombre: "Agar MacConkey",
        cantidad: 1,
        unidad_medida: "placa",
        costo_unitario: 3.90,
        lote: "MAC-2024-088",
        caducidad: "2024-09-30"
      },
      {
        id_insumo: 4004,
        nombre: "Discos antibióticos",
        cantidad: 8,
        unidad_medida: "unidad",
        costo_unitario: 0.85,
        lote: "ABX-2024-155",
        caducidad: "2025-02-28"
      }
    ]
  },
  {
    id_examen: 505,
    codigo: "HCG-005",
    descripcion: "Prueba de Embarazo en Sangre (β-hCG Cuantitativa)",
    precio: 42.80,
    categoria: "Hormonas",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "3-4 horas",
    insumos_utilizados: [
      {
        id_insumo: 5001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-090",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 5002,
        nombre: "Reactivo β-hCG",
        cantidad: 0.6,
        unidad_medida: "ml",
        costo_unitario: 18.50,
        lote: "HCG-2024-042",
        caducidad: "2024-12-31"
      },
      {
        id_insumo: 5003,
        nombre: "Calibradores hCG",
        cantidad: 0.1,
        unidad_medida: "ml",
        costo_unitario: 25.00,
        lote: "CAL-2024-028",
        caducidad: "2024-12-31"
      }
    ]
  },
  {
    id_examen: 506,
    codigo: "TSH-006",
    descripcion: "Hormona Estimulante de la Tiroides (TSH)",
    precio: 38.25,
    categoria: "Hormonas",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "24 horas",
    insumos_utilizados: [
      {
        id_insumo: 6001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-091",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 6002,
        nombre: "Reactivo TSH",
        cantidad: 1.2,
        unidad_medida: "ml",
        costo_unitario: 14.75,
        lote: "TSH-2024-036",
        caducidad: "2024-11-15"
      }
    ]
  },
  {
    id_examen: 507,
    codigo: "CREAT-007",
    descripcion: "Creatinina Sérica",
    precio: 32.00,
    categoria: "Función Renal",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "2-3 horas",
    insumos_utilizados: [
      {
        id_insumo: 7001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-092",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 7002,
        nombre: "Reactivo Creatinina (Jaffé)",
        cantidad: 1.5,
        unidad_medida: "ml",
        costo_unitario: 7.20,
        lote: "CREA-2024-051",
        caducidad: "2024-10-31"
      }
    ]
  },
  {
    id_examen: 508,
    codigo: "COAG-008",
    descripcion: "Tiempo de Protrombina (TP)",
    precio: 45.60,
    categoria: "Coagulación",
    tipo_muestra: "Plasma citratado",
    tiempo_procesamiento: "1-2 horas",
    insumos_utilizados: [
      {
        id_insumo: 8001,
        nombre: "Tubo Citrato 3.2% 2.7ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 3.40,
        lote: "CIT-2024-074",
        caducidad: "2025-07-15"
      },
      {
        id_insumo: 8002,
        nombre: "Reactivo Tromboplastina",
        cantidad: 0.5,
        unidad_medida: "ml",
        costo_unitario: 22.80,
        lote: "TP-2024-029",
        caducidad: "2024-12-31"
      },
      {
        id_insumo: 8003,
        nombre: "Cloruro de Calcio 0.025M",
        cantidad: 0.3,
        unidad_medida: "ml",
        costo_unitario: 4.15,
        lote: "CaCl-2024-063",
        caducidad: "2025-04-30"
      }
    ]
  },
  {
    id_examen: 509,
    codigo: "ELEC-009",
    descripcion: "Electrolitos Séricos (Na, K, Cl)",
    precio: 55.40,
    categoria: "Bioquímica",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "3-4 horas",
    insumos_utilizados: [
      {
        id_insumo: 9001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-093",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 9002,
        nombre: "Reactivo Sodio ISE",
        cantidad: 2.0,
        unidad_medida: "ml",
        costo_unitario: 9.80,
        lote: "NA-2024-041",
        caducidad: "2024-11-30"
      },
      {
        id_insumo: 9003,
        nombre: "Reactivo Potasio ISE",
        cantidad: 2.0,
        unidad_medida: "ml",
        costo_unitario: 10.25,
        lote: "K-2024-038",
        caducidad: "2024-11-30"
      }
    ]
  },
  {
    id_examen: 510,
    codigo: "VIH-010",
    descripcion: "Prueba de VIH (ELISA)",
    precio: 88.90,
    categoria: "Inmunología",
    tipo_muestra: "Suero sanguíneo",
    tiempo_procesamiento: "24-48 horas",
    insumos_utilizados: [
      {
        id_insumo: 10001,
        nombre: "Tubo SST 5ml",
        cantidad: 1,
        unidad_medida: "unidad",
        costo_unitario: 2.85,
        lote: "SST-2024-094",
        caducidad: "2025-08-15"
      },
      {
        id_insumo: 10002,
        nombre: "Kit ELISA VIH 1/2",
        cantidad: 1,
        unidad_medida: "kit",
        costo_unitario: 32.50,
        lote: "VIH-2024-017",
        caducidad: "2024-12-31"
      },
      {
        id_insumo: 10003,
        nombre: "Reactivo Substrato TMB",
        cantidad: 1.5,
        unidad_medida: "ml",
        costo_unitario: 8.40,
        lote: "TMB-2024-055",
        caducidad: "2024-10-31"
      }
    ]
  }
];

export {
  clientes,
  examenesMedicos
}