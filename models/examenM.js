const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class examenM {

  todoInsumo() {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT * FROM insumos';
      db.query(sql, function (err, res) {
        if (err) {
          return reject({ mensaje: err, status: 500 })
        }
        if (res.length) {
          resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
        } else {
          resolve({ data: res, mensaje: 'No hay insumos para mostrar', status: 200 })
        }
      })
    })
  }

  unoInsumo(nombre) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM insumos WHERE nombre LIKE ?';
      db.query(sql, ['%' + nombre + '%'], function (err, res) {
        if (err) {
          return reject({ mensaje: err, status: 500 })
        }
        if (res.length) {
          resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
        } else {
          resolve({ data: res, mensaje: 'No hay insumos para mostrar', status: 200 })
        }
      })
    })

  }

  crearInsumo(insumo) {
    return new Promise(async (resolve, reject) => {
      const { codigo, nombre, costo_unitario, unidad_medida } = insumo
      const id = uuidv4();
      const insumoInsertar = [id, codigo, nombre, costo_unitario, unidad_medida]
      const sql = 'INSERT INTO  insumos (id_insumo, codigo, nombre, costo_unitario, unidad_medida) VALUES (?,?,?,?,?)';
      const valido = camposRequeridos({ codigo, nombre, costo_unitario, unidad_medida })

      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }

      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, insumoInsertar, function (err, res) {
              if (err) {
                if (err.errno == 1062) {
                  return db.rollback(function () {
                    return resolve({ mensaje: 'Ya existe un insumo con el codigo ' + codigo, status: 409 })
                  });
                }
              }
              resolve({ mensaje: 'Insumo insertado con exito', data: insumoInsertar, status: 201 })
            })
          })
          const insumos = await this.todoInsumo()
          if (insert.status != 201) {
            return resolve({ data: insumos.data, mensaje: insert.mensaje, status: insert.status })
          }
          const data = await this.todoExamen()
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
          });
          resolve({ examenes: data.examenes, insumos: insumos.data, mensaje: insert.mensaje, status: insert.status })
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          })
        }
      })
    })

  }

  editarInsumo(insumo, id) {
    return new Promise(async (resolve, reject) => {
      const { codigo, nombre, costo_unitario, unidad_medida } = insumo
      const insumoEditar = [codigo, nombre, costo_unitario, unidad_medida, id]
      const sql = 'UPDATE insumos SET codigo=?, nombre=?, costo_unitario=?, unidad_medida=? WHERE id_insumo=?';
      const valido = camposRequeridos({ codigo, nombre, costo_unitario, unidad_medida })

      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }

      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const editado = await new Promise((resolve, reject) => {
            db.query(sql, insumoEditar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              if (res.affectedRows == 0) {
                resolve({ mensaje: 'No se encontro el insumo', status: 404 })
                return
              }
              resolve({ mensaje: 'Insumo editado con exito', data: insumoEditar, status: 200 })
            })
          })

          const insumos = await this.todoInsumo()
          if (editado.status != 200) {
            return resolve({ data: insumos.data, mensaje: editado.mensaje, status: editado.status })
          }
          const data = await this.todoExamen()
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
          });
          resolve({ examenes: data.examenes, insumos: insumos.data, mensaje: editado.mensaje, status: editado.status })
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          })
        }
      })
    })

  }

  eliminarInsumo(id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'DELETE FROM insumos WHERE id_insumo=?';
      const eliminado = await new Promise((resolve, reject) => {
        db.query(sql, [id], function (err, res) {
          if (err) {
            return db.rollback(function () {
              return reject({ mensaje: err, status: 500 })
            });
          }
          if (res.affectedRows == 0) {
            resolve({ mensaje: 'No se encontro el insumo', status: 404 })
            return
          }
          resolve({ mensaje: 'Insumo eliminado con exito', status: 200 })
        })
      })
      const insumos = await this.todoInsumo()
      const data = await this.todoExamen()
      if (eliminado.status != 200) {
        return resolve({ data: insumos.data, mensaje: eliminado.mensaje, status: eliminado.status })
      }
      resolve({ examenes: data.examenes, insumos: insumos.data, mensaje: eliminado.mensaje, status: eliminado.status })
    })
  }

  insumosUtilizados() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT u.id_insumo_utilizado, u.id_examen, u.id_insumo, i.nombre, u.cantidad_insumo, u.creado_en FROM insumos_utilizados u INNER JOIN insumos i ON u.id_insumo = i.id_insumo'
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

  todoExamen() {
    return new Promise(async (resolve, reject) => {
      try {
        const sql = 'SELECT * FROM examen WHERE activo = ?';
        const insumos = await this.todoInsumo()
        const insumosUtilizados = await this.insumosUtilizados()
        if (insumos.status != 200) {
          return reject({ mensaje: insumos.mensaje, status: 500 })
        }

        if (insumosUtilizados.status != 200) {
          return reject({ mensaje: insumosUtilizados.mensaje, status: 500 })
        }

        db.query(sql, [1], function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            const examenes = res
            examenes.forEach(e => {
              e.insumo_utilizados = insumosUtilizados.data.filter(i => i.id_examen == e.id_examen);
            });
            resolve({ examenes: res, insumos: insumos.data, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ examenes: res, insumos: insumos.data, mensaje: 'No hay examenes para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  unoExamen(nombre) {
    return new Promise(async (resolve, reject) => {
      const sql = 'SELECT * FROM examen WHERE nombre LIKE ? AND activo = ?';
      const insumos = await this.todoInsumo()
      db.query(sql, ['%' + nombre + '%', 1], function (err, res) {
        if (err) {
          return reject({ mensaje: err, status: 500 })
        }
        if (res.length) {
          resolve({ examenes: res, insumos: insumos.data, mensaje: 'Consulta exitosa', status: 200 })
        } else {
          resolve({ examenes: res, insumos: insumos.data, mensaje: 'No se encontraron examenes para mostrar', status: 200 })
        }
      })
    })
  }

  crearExamen(examen) {
    return new Promise(async (resolve, reject) => {
      const { nombre, codigo, descripcion, precio, duracion_minutos, requiere_ayuno, instrucciones_preparacion, insumos_utilizados } = examen
      const id = uuidv4();
      const ayuno = requiere_ayuno ? 1 : 0
      const insumosExamen = JSON.parse(insumos_utilizados || '[]')
      const examenInsertar = [id, nombre, codigo, descripcion, precio, duracion_minutos, ayuno, instrucciones_preparacion]
      const sql = 'INSERT INTO  examen (id_examen, nombre, codigo, descripcion, precio, duracion_estimada, requiere_ayuno, instrucciones_preparacion) VALUES (?,?,?,?,?,?,?,?)';
      const sqlInsumos = 'INSERT INTO insumos_utilizados (id_insumo_utilizado, id_examen, id_insumo, cantidad_insumo) VALUES ?';
      const valido = camposRequeridos({ nombre, codigo, descripcion, precio, duracion_minutos })
      let datos = []
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      if (!Array.isArray(insumosExamen)) {
        return reject({ mensaje: 'Los insumos utilizados deben ser un array', status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, examenInsertar, function (err, res) {
              if (err) {
                if (err.errno == 1062) {
                  return db.rollback(function () {
                    return resolve({ mensaje: 'Ya existe un examen con el codigo ' + codigo, status: 409 })
                  });
                }
                return reject({ mensaje: err, status: 500 })
              }
              resolve({ mensaje: 'Examen insertado con exito', data: examenInsertar, status: 201 })
            })
          })
          if (insert.status != 201) {
            const todo = await this.todoExamen()
            return resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: insert.mensaje, status: insert.status })
          }

          for (const insumo of insumosExamen) {
            datos.push([uuidv4(), id, insumo.id_insumo, insumo.cantidad_insumo])
          }
          await new Promise((resolve, reject) => {
            db.query(sqlInsumos, [datos], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito', data: datos, status: 201 })
            })
          })
          const todo = await this.todoExamen()
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
          });
          resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: 'Examen creado con exito', status: 201 })
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          })
        }
      })

    })
  }

  editarExamen(examen, id) {
    return new Promise(async (resolve, reject) => {
      const { nombre, codigo, descripcion, precio, duracion_minutos, requiere_ayuno, instrucciones_preparacion, insumos_utilizados } = examen
      const ayuno = requiere_ayuno ? 1 : 0
      const examenEditar = [nombre, codigo, descripcion, precio, duracion_minutos, ayuno, instrucciones_preparacion, id]
      const insumosExamen = JSON.parse(insumos_utilizados || '[]')
      const sql = 'UPDATE examen SET nombre = ?, codigo = ?, descripcion = ?, precio = ?, duracion_estimada = ?, requiere_ayuno = ?, instrucciones_preparacion = ?  WHERE id_examen = ?';
      const sqlInsumos = 'INSERT INTO insumos_utilizados (id_insumo_utilizado, id_examen, id_insumo, cantidad_insumo) VALUES ?';
      const eliminarRelacion = 'DELETE FROM insumos_utilizados WHERE id_examen = ?'
      let datos = []
      const valido = camposRequeridos({ nombre, codigo, descripcion, precio, duracion_minutos, instrucciones_preparacion })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      if (!Array.isArray(insumosExamen)) {
        return reject({ mensaje: 'Los insumos utilizados deben ser un array', status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const editado = await new Promise((resolve, reject) => {
            db.query(sql, examenEditar, function (err, res) {
              if (err) {
                return reject({ mensaje: err, status: 500 })
              }
              resolve({ mensaje: 'Examen editado con exito', data: examenEditar, status: 200 })
            })
          })
          if (editado.status != 200) {
            const todo = await this.todoExamen()
            return resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: editado.mensaje, status: editado.status })
          }
          await new Promise((resolve, reject) => {
            db.query(eliminarRelacion, [id], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito', status: 201 })
            })
          })
          for (const insumo of insumosExamen) {
            datos.push([uuidv4(), id, insumo.id_insumo, insumo.cantidad_insumo])
          }
          await new Promise((resolve, reject) => {
            db.query(sqlInsumos, [datos], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito', data: datos, status: 201 })
            })
          })
          const todo = await this.todoExamen()
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
          });
          resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: 'Examen creado con exito', status: 201 })
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          })
        }
      })
    })
  }

  eliminarExamen(id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'UPDATE examen SET activo = 0 WHERE id_examen = ?';
      if (!id) {
        reject({ mensaje: 'ID es requerido', status: 400 })
      }
      try {
        const eliminado = await new Promise((resolve, reject) => {
          db.query(sql, [id], function (err, res) {
            if (err) {
              return reject({ mensaje: err, status: 500 })
            }
            if (res.affectedRows == 0) {
              resolve({ mensaje: 'No se encontro el examen', status: 404 })
              return
            }
            resolve({ mensaje: 'Examen eliminado con exito', status: 200 })
          })
        })
        const todo = await this.todoExamen()
        if (eliminado.status != 200) {
          return resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: eliminado.mensaje, status: eliminado.status })
        }
        resolve({ examenes: todo.examenes, insumos: todo.insumos, mensaje: eliminado.mensaje, status: eliminado.status })
      } catch (error) {
        reject(error)
      }
    })
  }

}

module.exports = new examenM();
