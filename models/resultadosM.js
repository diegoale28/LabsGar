const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class resultadosM {

  listarDoctores() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT * FROM medicos WHERE activo = 1';
      const sqlOrden = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre, c.apellido, c.cedula, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli WHERE estado = ?'
      const estado = ['procesando']
      try {
        const medicos = await new Promise((resolve, reject) => {
          db.query(sql, function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay medicos para mostrar', status: 200 })
            }
          })
        })
        const ordenes = await new Promise((resolve, reject) => {
          db.query(sqlOrden, [estado], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay medicos para mostrar', status: 200 })
            }
          })
        })
        resolve({ medicos: medicos.data, ordenes: ordenes.data, mensaje: 'Consulta exitosa', status: 200 })
      } catch (error) {
        reject(error)
      }
    })
  }

  todos() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT r.id_res, r.id_orden, o.estado, o.numero_orden, r.resultado, r.interpretacion, r.fecha, r.observaciones, r.id_medico, c.nombre AS nombre_cli, c.apellido AS apellido_cli, c.cedula, c.telefono AS tel_cli, u.id_usu, u.nombre AS nombre_usu, u.apellido AS apellido_usu, m.nombre AS nombre_med, m.apellido AS apellido_med, m.especialidad, m.telefono AS telefono_med FROM resultados r INNER JOIN orden o ON r.id_orden = o.id_orden INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON o.id_usu = u.id_usu INNER JOIN medicos m ON m.id_medico = r.id_medico'
      try {
        const listas = await this.listarDoctores()
        if (listas.status != 200) {
          reject({ mensaje: listas.mensaje, status: listas.status })
        }
        db.query(sql, function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ resultados: res, medicos: listas.medicos, ordenes: listas.ordenes, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ resultados: res, medicos: listas.medicos, ordenes: listas.ordenes, mensaje: 'No hay medicos para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  crear(datos) {
    return new Promise((resolve, reject) => {
      const { id_orden, resultado, interpretacion, observaciones, id_medico } = datos
      const sql = 'INSERT INTO resultados (id_res, id_orden, resultado, interpretacion, observaciones, id_medico) VALUES (?,?,?,?,?,?)'
      const sqlOrden = 'UPDATE orden SET estado = ? WHERE id_orden = ?'
      const estado = ['completado', id_orden]
      const resultadoInsertar = [uuidv4(), id_orden, resultado, interpretacion, observaciones, id_medico]
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, resultadoInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Orden insertada con exito', data: resultadoInsertar, status: 201 })
            })
          })
          const ordenEstado = await new Promise((resolve, reject) => {
            db.query(sqlOrden, estado, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              if (res.affectedRows == 0) {
                resolve({ mensaje: 'No se encontro la orden', status: 404 })
                return
              }
              resolve({ mensaje: 'Orden completada con exito', status: 200 })
            })
          })
          if (ordenEstado.status != 200) {
            reject({ mensaje: ordenEstado.mensaje, status: ordenEstado.status })
          }
          const todo = await this.todos()
          if (todo.status != 200) {
            reject({ mensaje: listas.mensaje, status: listas.status })
          }
          if (insert.status != 201) {
            return resolve({ resultados: todo.resultados, medicos: todo.medicos, ordenes: todo.ordenes, mensaje: insert.mensaje, status: insert.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ resultados: todo.resultados, medicos: todo.medicos, ordenes: todo.ordenes, mensaje: insert.mensaje, status: insert.status })
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

module.exports = new resultadosM();