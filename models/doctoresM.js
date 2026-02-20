const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class doctoresM {
  todos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM medicos WHERE activo = 1';
      try {
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
      } catch (error) {
        reject(error)
      }

    })
  }

  uno(especialidad) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM medicos WHERE especialidad LIKE ? AND activo = 1';
      try {
        db.query(sql, [especialidad], function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
          } else {
            resolve({ data: res, mensaje: 'No hay medicos para mostrar', status: 200 })
          }
        })
      } catch (error) {
        reject(error)
      }
    })

  }

  crear(medico) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, especialidad, codigo, telefono, direccion } = medico
      const id = uuidv4();
      let telefonoCompleto = null;
      if (codigo && telefono) {
        telefonoCompleto = codigo + '-' + telefono;
      }
      const medicoInsertar = [id, nombre, apellido, especialidad, telefonoCompleto, direccion]
      const sql = 'INSERT INTO  medicos (id_medico, nombre, apellido, especialidad, telefono, direccion) VALUES (?,?,?,?,?,?)';
      const valido = camposRequeridos({ nombre, apellido, especialidad, telefonoCompleto, direccion })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, medicoInsertar, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Doctor insertado con exito', data: medicoInsertar, status: 201 })
            })
          })
          const medicos = await this.todos()
          if (insert.status != 201) {
            return resolve({ data: medicos.data, mensaje: insert.mensaje, status: insert.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: medicos.data, mensaje: insert.mensaje, status: insert.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

  editar(medico, id) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, especialidad, codigo, telefono, direccion } = medico
      let telefonoCompleto = null;
      if (codigo && telefono) {
        telefonoCompleto = codigo + '-' + telefono;
      }
      const medicoEditado = [nombre, apellido, especialidad, telefonoCompleto, direccion, id]
      const sql = 'UPDATE medicos SET nombre=?, apellido=?, especialidad=?, telefono=?, direccion=? WHERE  id_medico = ?';
      const valido = camposRequeridos({ nombre, apellido, especialidad, telefonoCompleto, direccion })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const editado = await new Promise((resolve, reject) => {
            db.query(sql, medicoEditado, function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Doctor editado con exito', data: medicoEditado, status: 200 })
            })
          })
          const medicos = await this.todos()
          if (editado.status != 200) {
            return resolve({ data: medicos.data, mensaje: editado.mensaje, status: editado.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: medicos.data, mensaje: editado.mensaje, status: editado.status })
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
      const sql = 'UPDATE medicos SET activo=0 WHERE  id_medico = ?';
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
              resolve({ mensaje: 'Doctor eliminado con exito', status: 200 })
            })
          })
          const medicos = await this.todos()
          if (eliminado.status != 200) {
            return resolve({ data: medicos.data, mensaje: eliminado.mensaje, status: eliminado.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: medicos.data, mensaje: eliminado.mensaje, status: eliminado.status })
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

module.exports = new doctoresM();