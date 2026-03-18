import dotenv from "dotenv";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise"; 
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

dotenv.config();

async function ejecutarMigracion() {
    let connection;
    try {
        // 1. Leer el archivo SQL local
        const sqlFileContent = await fs.readFile('./labsgar.sql', 'utf-8');

        // 2. Conexión inicial a MySQL (sin especificar DB para poder crearla si falta)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            multipleStatements: true 
        });

        console.log("Conexión establecida. Procesando base de datos y tablas...");

        // 3. Ejecutar el contenido de labsgar.sql (Crea DB, Tablas y Relaciones)
        await connection.query(sqlFileContent);
        console.log("Estructura de base de datos procesada correctamente.");

        // 4. Configurar datos del usuario a insertar
        const nombreNuevo = 'Diego';
        const apellidoNuevo = 'Admin';
        const usuarioNuevo = 'diego_admin'; 
        const clavePlana = 'admin'; // Esta es la clave que quieres encriptar
        const nombreRol = 'administrador';

        // 5. Encriptar la clave con bcrypt
        const saltRounds = 10;
        const hash = await bcrypt.hash(clavePlana, saltRounds);

        console.log("Insertando datos de usuario y roles...");

        const queries = [
            // Crear el rol para cumplir con la llave foránea de la tabla usuarios
            `INSERT IGNORE INTO rol (id_rol, rol) VALUES ('${uuidv4()}', '${nombreRol}');`,

            // Insertar el usuario con su ID único y clave encriptada
            `INSERT IGNORE INTO usuarios (id_usu, nombre, apellido, rol, usuario, clave) 
             VALUES (
                '${uuidv4()}', 
                '${nombreNuevo}', 
                '${apellidoNuevo}', 
                (SELECT id_rol FROM rol WHERE rol='${nombreRol}' LIMIT 1), 
                '${usuarioNuevo}', 
                '${hash}'
             );`,

            // Crear índice en la tabla clientes como mejora de búsqueda
            `ALTER TABLE clientes ADD INDEX IF NOT EXISTS idx_cedula_identificacion (cedula);`
        ];

        // 6. Ejecutar las consultas de inserción y configuración
        for (const query of queries) {
            await connection.query(query);
        }

        console.log("--------------------------------------------------");
        console.log("✅ ¡PROCESO COMPLETADO CON ÉXITO!");
        console.log(`Base de datos: ${process.env.DB_DATABASE}`);
        console.log(`Usuario Creado: ${usuarioNuevo}`);
        console.log(`Clave (en texto plano): ${clavePlana}`);
        console.log("--------------------------------------------------");

    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error("❌ Error: No se encontró el archivo 'labsgar.sql'. Asegúrate de que esté en la raíz del proyecto.");
        } else {
            console.error("❌ Error durante la migración:", error.message);
        }
    } finally {
        if (connection) await connection.end();
    }
}

ejecutarMigracion();