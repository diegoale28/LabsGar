const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class ventasM {

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
          resolve({ data: res, mensaje: 'No hay datos para mostrar', status: 200 })
        }
      })
    })
  }

  ordenes() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre, c.apellido, c.cedula, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli WHERE estado = ?';
      const estado = ['pendiente']
      try {
        const lista = await this.listaExamenes()
        if (lista.status != 200) {
          return reject({ mensaje: lista.mensaje, status: 500 })
        }
        const ordenes = await new Promise((resolve, reject) => {
          db.query(sql, estado, function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              const listaExistente = res
              listaExistente.forEach(l => {
                l.lista_examenes = lista.data.filter(i => i.id_orden == l.id_orden);
              });
              resolve({ data: listaExistente, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay ordenes para mostrar', status: 200 })
            }
          })
        })
        resolve(ordenes)
      } catch (error) {
        reject(error)
      }
    })
  }

  crear(venta) {
    return new Promise((resolve, reject) => {
      const { pago, subtotal, iva, total, orden } = venta
      const datos = JSON.parse(orden)
      const sql = 'INSERT INTO ventas (id_ven, id_cli, id_orden, subtotal, iva, total, metodo_pago) VALUES (?,?,?,?,?,?,?)'
      const sqlOrden = 'UPDATE orden SET estado = ? WHERE id_orden = ?'
      const ventaInsertar = [uuidv4(), datos.id_cli, datos.id_orden, subtotal, iva, total, pago]
      const ordenEditada = ['procesando', datos.id_orden]
      const valido = camposRequeridos({ pago, subtotal, iva, total })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, ventaInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Venta aprobada', status: 201 })
            })
          })

          const procesando = await new Promise((resolve, reject) => {
            db.query(sqlOrden, ordenEditada, function (err, res) {
              if (err) {
                return reject({ mensaje: err, status: 500 })
              }
              if (res.affectedRows == 0) {
                resolve({ mensaje: 'No se encontro la orden', status: 404 })
                return
              }
              resolve({ mensaje: 'Orden procesandose', status: 200 })
            })
          })

          const lista = await this.ordenes()
          
          if (procesando.status != 200) {
            return resolve({ data: lista.data, mensaje: procesando.mensaje, status: procesando.status })
          }
          
          if (insert.status != 201) {
            return resolve({ data: lista.data, mensaje: insert.mensaje, status: insert.status })
          }
          
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: lista.data, mensaje: insert.mensaje, status: insert.status })
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


module.exports = new ventasM();