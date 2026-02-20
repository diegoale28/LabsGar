const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class historiasM {
  todos() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT h.id_hist, h.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, c.telefono, c.direccion, h.id_orden, h.fecha, h.id_usu_registra, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.numero_orden, o.estado, o.observaciones FROM historia h INNER JOIN clientes c ON h.id_cli = c.id_cli INNER JOIN usuarios u ON h.id_usu_registra = u.id_usu INNER JOIN orden o ON h.id_orden = o.id_orden'
      try {
        db.query(sql, function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ historias: res, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ historias: res, mensaje: 'No hay clientes para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(err)
      }
    })
  }

  listaExamenes() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT d.id_detalle, d.id_orden, d.id_examen, d.precio, e.nombre, e.codigo, e.requiere_ayuno FROM orden_detalle d INNER JOIN examen e ON e.id_examen = d.id_examen WHERE e.activo = 1'
      db.query(sql, function (err, res) {
        if (err) {
          return reject({ mensaje: err, status: 500 })
        }
        if (res.length) {
          resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
        } else {
          resolve({ data: res, mensaje: 'No hay historias para mostrar', status: 200 })
        }
      })
    })
  }

  uno(cedula) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT h.id_hist, h.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, c.telefono, c.direccion, h.id_orden, h.fecha, h.id_usu_registra, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.numero_orden, o.estado, o.observaciones FROM historia h INNER JOIN clientes c ON h.id_cli = c.id_cli INNER JOIN usuarios u ON h.id_usu_registra = u.id_usu INNER JOIN orden o ON h.id_orden = o.id_orden WHERE c.cedula LIKE ?'

      try {
        db.query(sql, ['%'+cedula], function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ historias: res, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ historias: res, mensaje: 'No hay historias para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(err)
      }
    })
  }

  detalle(id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT h.id_hist, h.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, c.telefono, c.direccion, h.id_orden, h.fecha, h.id_usu_registra, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.numero_orden, o.estado, o.observaciones FROM historia h INNER JOIN clientes c ON h.id_cli = c.id_cli INNER JOIN usuarios u ON h.id_usu_registra = u.id_usu INNER JOIN orden o ON h.id_orden = o.id_orden WHERE h.id_hist = ?'

      try {
        const lista = await this.listaExamenes()
        if (lista.status != 200) {
          return reject({ mensaje: lista.mensaje, status: 500 })
        }
        const resultado = await new Promise((resolve, reject) => {
          db.query(sql, [id], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              const listaExistente = res
              listaExistente.forEach(l => {
                l.lista_examenes = lista.data.filter(i => i.id_orden == l.id_orden);
              });
              resolve({ data: listaExistente[0], mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay historias para mostrar', status: 200 })
            }
          })
        })
        resolve({ historias: resultado.data, mensaje: resultado.mensaje, status: resultado.status })
      } catch (error) {
        reject(err)
      }
    })
  }

}


module.exports = new historiasM();