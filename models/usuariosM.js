const db = require('../database/coneccion')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
require('dotenv').config()
const { camposRequeridos } = require('../funciones/validaciones');


class usuariosM {

  login(data) {
    return new Promise(async (resolve, reject) => {
      const { usuario, clave } = data
      const valido = camposRequeridos({ usuario, clave })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      try {
        const user = await new Promise((resolve, reject) => {
          const sql = 'SELECT u.id_usu, u.nombre, u.apellido, u.clave, r.rol FROM usuarios u INNER JOIN rol r ON u.rol = r.id_rol WHERE u.usuario = ? AND u.activo = ?'
          db.query(sql, [usuario, 1], (error, result) => {
            if (error) return reject({ status: 400, mensaje: error });
            if (result.length === 0) {
              return resolve({ status: 404, mensaje: 'Usuario no encontrado o inactivo' });
            }
            resolve(result[0]);
          })
        })
        bcrypt.compare(clave, user.clave, function (err, result) {
          if (!result) {
            return resolve({ status: 401, mensaje: 'Contraseña incorrecta' });
          } else {
            const token = jwt.sign({ id: user.id_usu, usuario: usuario, nombre: user.nombre, apellido: user.apellido, rol: user.rol }, process.env.SECRET, { expiresIn: '6h' });
            resolve({ status: 200, mensaje: 'Login exitoso', token: token });
          }
        });
      } catch (error) {
        reject(error)
      }
    })
  }

  listaUsuarios() {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = 'SELECT u.id_usu, u.nombre, u.apellido, u.usuario, r.rol FROM usuarios u INNER JOIN rol r ON u.rol = r.id_rol WHERE u.activo = ?'
        db.query(sql, [1], (error, result) => {
          if (error) return reject({ status: 400, mensaje: error });
          if (result.length === 0) {
            return resolve({ status: 404, mensaje: 'Usuario no encontrado o inactivo' });
          }
          resolve({ status: 200, mensaje: 'Consulta exitosa', data: result });
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  registrar(data) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, usuario, clave, rol_usu } = data
      const valido = camposRequeridos({ nombre, apellido, usuario, clave, rol_usu })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      const hash = await new Promise((resolve, reject) => {
        bcrypt.hash(clave, saltRounds, function (error, hash) {
          if (error) reject(error)
          resolve(hash);
        });
      })
      const info = [uuidv4(), nombre, apellido, usuario, hash, rol_usu, 1]
      const sql = 'INSERT INTO usuarios (id_usu, nombre, apellido, usuario, clave, rol, activo) VALUES (?,?,?,?,?,?,?)'
      const roles = await this.roles()
      db.query(sql, info, (error, result) => {
        if (error) {
          if (error.errno === 1062) {
            return resolve({ status: 400, mensaje: 'Usuario ya existe', roles: roles.data });
          }
          return reject({ status: 400, mensaje: error });
        }
        resolve({ status: 200, mensaje: 'Usuario registrado correctamente', roles: roles.data });
      })
    })

  }

  roles() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT * FROM rol'
      db.query(sql, (error, result) => {
        if (error) return reject({ status: 400, mensaje: error });
        resolve({ status: 200, mensaje: 'Consulta exitosa', data: result });
      })
    })

  }

}

module.exports = new usuariosM();