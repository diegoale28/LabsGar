const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class ordenesM {

  todos() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre, c.apellido, o.id_usu, u.nombre, u.apellido, o.id_examen, o.estado, o.observaciones, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON u.id_usu = o.id_usu';
      const sqlClientes = 'SELECT * FROM clientes where activo = 1';
      const sqlEfermeros = 'SELECT u.id_usu, u.nombre, u.apellido, r.rol FROM usuarios u INNER JOIN rol r ON u.rol = r.id_rol WHERE r.rol = ?';
      const rol = 'Enfermero/Enfermera'
      try {
        const ordenes = await new Promise((resolve, reject) => {
          db.query(sql, function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay ordenes para mostrar', status: 200 })
            }
          })
        })
        const clientes = await new Promise((resolve, reject) => {
          db.query(sqlClientes, function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay clientes para mostrar', status: 200 })
            }
          })
        })
        const enfermeros = await new Promise((resolve, reject) => {
          db.query(sqlEfermeros, [rol], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay usuarios para mostrar', status: 200 })
            }
          })
        })
        if (clientes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, enfermeros:enfermeros.data, mensaje: clientes.mensaje, status: clientes.status })
        }
        if (enfermeros.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, enfermeros:enfermeros.data, mensaje: enfermeros.mensaje, status: enfermeros.status })
        }
        if (ordenes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, enfermeros:enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
        }
        resolve({ ordenes: ordenes.data, clientes: clientes.data, enfermeros:enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
      } catch (error) {
        reject(error)
      }
    })
  }

  uno(numero) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre, c.apellido, o.id_usu, u.nombre, u.apellido, o.id_examen, o.estado, o.observaciones, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON u.id_usu = o.id_usu WHERE numero_orden = ?';
      try {
        db.query(sql, [numero], function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ data: res, mensaje: 'No hay ordenes para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  crear(orden) {
    return new Promise(async (resolve, reject) => {
      const { id_cli, id_usu, id_examen, estado, observaciones } = orden
      const id = uuidv4();
      const ordenInsertar = [id, id_cli, id_usu, id_examen, estado, observaciones]
      const sql = 'INSERT INTO  orden (id_orden, id_cli, id_usu, id_examen, estado, observaciones) VALUES (?,?,?,?,?,?)';
      const valido = camposRequeridos({ id_cli, id_usu, id_examen, estado })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, ordenInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Orden insertada con exito', data: ordenInsertar, status: 201 })
            })
          })
          const ordenes = await this.todos()
          if (insert.status != 201) {
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: insert.mensaje, status: insert.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: insert.mensaje, status: insert.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

  editar(orden, id) {
    return new Promise(async (resolve, reject) => {
      const { id_cli, id_usu, id_examen, estado, observaciones } = orden

      const ordenEditado = [id_cli, id_usu, id_examen, estado, observaciones, id]
      const sql = 'UPDATE orden SET id_cli=?, id_usu=?, id_examen=?, estado=?, observaciones=? WHERE  id_orden = ?';
      const valido = camposRequeridos({ id_cli, id_usu, id_examen, estado, observaciones })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const editado = await new Promise((resolve, reject) => {
            db.query(sql, ordenEditado, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Orden editada con exito', data: ordenEditado, status: 200 })
            })
          })
          const ordenes = await this.todos()
          if (editado.status != 200) {
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: editado.mensaje, status: editado.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: editado.mensaje, status: editado.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM orden WHERE id_orden = ?';
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const eliminado = await new Promise((resolve, reject) => {
            db.query(sql, [id], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Orden eliminada con exito', status: 200 })
            })
          })
          const ordenes = await this.todos()
          if (eliminado.status != 200) {
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: eliminado.mensaje, status: eliminado.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, enfermeros:ordenes.enfermeros, mensaje: eliminado.mensaje, status: eliminado.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

}

module.exports = new ordenesM();