const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class ordenesM {

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

  todos() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, o.id_usu, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.estado, o.observaciones, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON u.id_usu = o.id_usu ORDER BY o.numero_orden DESC';
      const sqlClientes = 'SELECT * FROM clientes where activo = 1';
      const sqlEfermeros = 'SELECT u.id_usu, u.nombre, u.apellido, r.rol FROM usuarios u INNER JOIN rol r ON u.rol = r.id_rol WHERE r.rol = ?';
      const sqlExamenes = 'SELECT * FROM examen WHERE activo = ?';
      const rol = 'Enfermero/Enfermera'
      try {
        const lista = await this.listaExamenes()
        if (lista.status != 200) {
          return reject({ mensaje: lista.mensaje, status: 500 })
        }
        const ordenes = await new Promise((resolve, reject) => {
          db.query(sql, function (err, res) {
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
        const examenes = await new Promise((resolve, reject) => {
          db.query(sqlExamenes, [1], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay examenes para mostrar', status: 200 })
            }
          })
        })
        if (clientes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: clientes.mensaje, status: clientes.status })
        }
        if (enfermeros.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: enfermeros.mensaje, status: enfermeros.status })
        }
        if (examenes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: enfermeros.mensaje, status: enfermeros.status })
        }
        if (ordenes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
        }
        resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
      } catch (error) {
        reject(error)
      }
    })
  }

  filtros(filtro) {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, o.id_usu, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.estado, o.observaciones, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON u.id_usu = o.id_usu WHERE estado = ? ORDER BY o.numero_orden DESC';
      const sqlClientes = 'SELECT * FROM clientes where activo = 1';
      const sqlEfermeros = 'SELECT u.id_usu, u.nombre, u.apellido, r.rol FROM usuarios u INNER JOIN rol r ON u.rol = r.id_rol WHERE r.rol = ?';
      const sqlExamenes = 'SELECT * FROM examen WHERE activo = ?';
      const rol = 'Enfermero/Enfermera'
      try {
        const ordenes = await new Promise((resolve, reject) => {
          db.query(sql, [filtro], function (err, res) {
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
        const examenes = await new Promise((resolve, reject) => {
          db.query(sqlExamenes, [1], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay examenes para mostrar', status: 200 })
            }
          })
        })
        if (clientes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: clientes.mensaje, status: clientes.status })
        }
        if (enfermeros.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: enfermeros.mensaje, status: enfermeros.status })
        }
        if (examenes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: enfermeros.mensaje, status: enfermeros.status })
        }
        if (ordenes.status != 200) {
          return resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
        }
        resolve({ ordenes: ordenes.data, clientes: clientes.data, examenes: examenes.data, enfermeros: enfermeros.data, mensaje: ordenes.mensaje, status: ordenes.status })
      } catch (error) {
        reject(error)
      }
    })
  }

  uno(id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT o.id_orden, o.numero_orden, o.id_cli, c.nombre AS nombre_cliente, c.apellido AS apellido_cliente, c.cedula, o.id_usu, u.nombre AS nombre_encargado, u.apellido AS apellido_encargado, o.estado, o.observaciones, o.fecha FROM orden o INNER JOIN clientes c ON o.id_cli = c.id_cli INNER JOIN usuarios u ON u.id_usu = o.id_usu WHERE o.id_orden = ?';
      const sqlExamenes = 'SELECT d.id_detalle, d.id_orden, d.id_examen, d.precio, e.nombre, e.codigo, e.requiere_ayuno FROM orden_detalle d INNER JOIN examen e ON e.id_examen = d.id_examen WHERE d.id_orden = ? AND e.activo = 1';
      try {
        const listaExamenes = await new Promise((resolve, reject) => {
          db.query(sqlExamenes, [id], function (err, res) {
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
        const detalle = await new Promise((resolve, reject) => {
          db.query(sql, [id], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.length) {
              const listaExistente = res
              listaExistente.forEach(l => {
                l.lista_examenes = listaExamenes.data.filter(i => i.id_orden == l.id_orden);
              });
              resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
            } else {
              resolve({ data: res, mensaje: 'No hay ordenes para mostrar', status: 200 })
            }
          })
        })
        resolve({ ordenes: detalle.data[0], mensaje: detalle.mensaje, status: detalle.status })

      } catch (error) {
        reject(error)
      }
    })
  }

  cambiar(estado, id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'UPDATE orden SET estado = ? WHERE id_orden = ?';
      const estadoInsertar = [estado, id]
      try {
        const respuesta = await new Promise((resolve, reject) => {
          db.query(sql, estadoInsertar, function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.affectedRows == 0) {
              resolve({ mensaje: 'No se encontro la orden', status: 404 })
              return
            }
            resolve({ mensaje: 'Estado cambiado exitosamente', status: 200 })
          })
        })
        if (respuesta.status != 200) {
          return resolve({ mensaje: respuesta.mensaje, status: respuesta.status })
        }
        const orden = await this.uno(id)
        resolve({ ordenes: orden.ordenes, mensaje: respuesta.mensaje, status: respuesta.status })
      } catch (error) {
        reject(error)
      }
    })
  }

  crear(orden) {
    return new Promise(async (resolve, reject) => {
      const { id_cli, id_usu, observaciones, lista_examenes } = orden
      const id = uuidv4();
      const ordenInsertar = [id, id_cli, id_usu, observaciones]
      const historiaInsertar = [uuidv4(), id_cli, id, id_usu]
      const lista = JSON.parse(lista_examenes)
      let listaInsertar = []
      const sql = 'INSERT INTO  orden (id_orden, id_cli, id_usu, observaciones) VALUES (?,?,?,?)';
      const sqlDetalle = 'INSERT INTO orden_detalle (id_detalle, id_orden, id_examen, precio) VALUES ?'
      const sqlHistoria = 'INSERT INTO historia (id_hist, id_cli, id_orden, id_usu_registra) VALUES (?,?,?,?)'
      const valido = camposRequeridos({ id_cli, id_usu })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      if (!Array.isArray(lista)) {
        return reject({ mensaje: 'Los examenes deben ser un array', status: 400 })
      }
      for (const examen of lista) {
        listaInsertar.push([uuidv4(), id, examen.id_examen, examen.precio])
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

          const historiaCreada = await new Promise((resolve, reject) => {
            db.query(sqlHistoria, historiaInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Historia insertada con exito', data: ordenInsertar, status: 201 })
            })
          })

          const listaDetalle = await new Promise((resolve, reject) => {
            db.query(sqlDetalle, [listaInsertar], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito', data: listaInsertar, status: 201 })
            })
          })
          if (listaDetalle.status != 201) {
            return reject({ mensaje: listaDetalle.mensaje, status: listaDetalle.status })
          }

          if (historiaCreada.status != 201) {
            return reject({ mensaje: historiaCreada.mensaje, status: listaDetalle.status })
          }

          const ordenes = await this.todos()
          if (insert.status != 201) {
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: insert.mensaje, status: insert.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: insert.mensaje, status: insert.status })
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
      const { id_cli, id_usu, observaciones, lista_examenes } = orden
      const ordenEditado = [id_cli, id_usu, observaciones, id]
      const sql = 'UPDATE orden SET id_cli=?, id_usu=?, observaciones=? WHERE  id_orden = ?';
      const sqlElimiar = 'DELETE FROM orden_detalle WHERE id_orden = ?'
      const sqlDetalle = 'INSERT INTO orden_detalle (id_detalle, id_orden, id_examen, precio) VALUES ?'
      const sqlEliminarHistoria = 'DELETE FROM historia WHERE id_orden = ?'
      const sqlHistoria = 'INSERT INTO historia (id_hist, id_cli, id_orden, id_usu_registra) VALUES (?,?,?,?)'
      const lista = JSON.parse(lista_examenes)
      const historiaInsertar = [uuidv4(), id_cli, id, id_usu]
      let listaInsertar = []
      for (const examen of lista) {
        listaInsertar.push([uuidv4(), id, examen.id_examen, examen.precio])
      }
      const valido = camposRequeridos({ id_cli, id_usu })
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

          if (editado.status != 200) {
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: editado.mensaje, status: editado.status })
          }

          const eliminarDetalles = await new Promise((resolve, reject) => {
            db.query(sqlElimiar, [id], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito eliminar detalle', status: 200 })
            })
          })

          if (eliminarDetalles.status != 200) {
            return reject({ mensaje: eliminarDetalles.mensaje, status: eliminarDetalles.status })
          }

          const listaDetalle = await new Promise((resolve, reject) => {
            db.query(sqlDetalle, [listaInsertar], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito detalle', data: listaInsertar, status: 201 })
            })
          })

          if (listaDetalle.status != 201) {
            return reject({ mensaje: listaDetalle.mensaje, status: listaDetalle.status })
          }

          const eliminarHistoria = await new Promise((resolve, reject) => {
            db.query(sqlEliminarHistoria, [id], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito al eliminar historia', status: 200 })
            })
          })
          if (eliminarHistoria.status != 200) {
            return reject({ mensaje: eliminarHistoria.mensaje, status: eliminarHistoria.status })
          }

          const historiaCreada = await new Promise((resolve, reject) => {
            db.query(sqlHistoria, historiaInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Historia insertada con exito', data: historiaInsertar, status: 201 })
            })
          })

          if (historiaCreada.status != 201) {
            return reject({ mensaje: historiaCreada.mensaje, status: listaDetalle.status })
          }
          const ordenes = await this.todos()

          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: editado.mensaje, status: editado.status })
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
            return resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: eliminado.mensaje, status: eliminado.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ ordenes: ordenes.ordenes, clientes: ordenes.clientes, examenes: ordenes.examenes, enfermeros: ordenes.enfermeros, mensaje: eliminado.mensaje, status: eliminado.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

  historia() {

  }

}

module.exports = new ordenesM();