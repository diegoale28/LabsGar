const { v4: uuidv4 } = require('uuid');
const db = require('../database/coneccion')
const { camposRequeridos } = require('../funciones/validaciones')

class clientesM {
  todos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM clientes where activo = 1';
      db.query(sql, function (err, res) {
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

  }

  uno(cedula) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM clientes where activo = 1 AND cedula LIKE ?';
      db.query(sql, ['%' + cedula], function (err, res) {
        if (err) {
          return reject({ mensaje: err, status: 500 })
        }
        if (res.length) {
          resolve({ data: res, mensaje: 'Consulta exitosa', status: 200 })
        } else {
          resolve({ data: res, mensaje: 'No se encontro el cliente', status: 404 })
        }
      })
    })

  }

  crear(cliente) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, prefijo, cedula, codigo, telefono, genero, direccion } = cliente
      const id = uuidv4();
      let telefonoCompleto = null;
      if (codigo && telefono) {
        telefonoCompleto = codigo + '-' + telefono;
      }
      const cedulaCompleta = prefijo + cedula;
      const clienteInsertar = [id, nombre, apellido, cedulaCompleta, telefonoCompleto, genero, direccion]
      const sql = 'INSERT INTO  clientes (id_cli, nombre, apellido, cedula, telefono, genero, direccion) VALUES (?,?,?,?,?,?,?)';
      const valido = camposRequeridos({ nombre, apellido, cedulaCompleta, genero, direccion })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      db.beginTransaction(async function (err) {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          const insert = await new Promise((resolve, reject) => {
            db.query(sql, clienteInsertar, function (err, res) {
              if (err) {
                if (err.errno == 1062) {
                  return db.rollback(function () {
                    return resolve({ mensaje: 'Ya existe un cliente con la cedula ' + prefijo + cedula, status: 409 })
                  });
                }
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Cliente insertado con exito', data: clienteInsertar, status: 201 })
            })
          })
          const clientes = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clientes where activo = 1';
            db.query(sql, function (err, res) {
              if (err) {
                return reject({ mensaje: err, status: 500 })
              }
              if (res.length) {
                resolve({ data: res, status: 200 })
              } else {
                resolve({ data: res, status: 200 })
              }
            })
          })
          if (insert.status != 201) {
            return resolve({ data: clientes.data, mensaje: insert.mensaje, status: insert.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: clientes.data, mensaje: insert.mensaje, status: insert.status })
          });
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      });
    })
  }

  editar(cliente, id) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, prefijo, cedula, codigo, telefono, genero, direccion } = cliente
      let telefonoCompleto = null;
      if (codigo && telefono) {
        telefonoCompleto = codigo + '-' + telefono;
      }
      const cedulaCompleta = prefijo + cedula;
      const clienteEditado = [nombre, apellido, cedulaCompleta, telefonoCompleto, genero, direccion, id]
      const valido = camposRequeridos({ nombre, apellido, cedula, genero, direccion })
      if (!valido.resultado) {
        return reject({ mensaje: valido.mensaje, status: 400 })
      }
      const sql = 'UPDATE clientes SET nombre = ?, apellido = ?, cedula = ?, telefono = ?, genero = ?, direccion = ? WHERE id_cli = ?';
      db.beginTransaction(async function (err) {
        try {
          if (err) { return reject({ mensaje: err, status: 500 }) }

          const editar = await new Promise((resolve, reject) => {
            db.query(sql, clienteEditado, function (err, res) {
              if (err) {
                if (err.errno == 1062) {
                  return resolve({ mensaje: 'Ya existe un cliente con la cedula ' + cedula, status: 409 })
                }
                return reject({ mensaje: err, status: 500 })
              }
              if (res.affectedRows == 0) {
                resolve({ mensaje: 'No se encontro el cliente', status: 404 })
                return
              }
              resolve({ mensaje: 'Cliente editado con exito', data: clienteEditado, status: 200 })
            })
          })

          const clientes = await new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM clientes where activo = 1';
            db.query(sql, function (err, res) {
              if (err) {
                return reject({ mensaje: err, status: 500 })
              }
              if (res.length) {
                resolve({ data: res, status: 200 })
              } else {
                resolve({ data: res, status: 200 })
              }
            })
          })
          if (editar.status != 200) {
            return resolve({ data: clientes.data, mensaje: editar.mensaje, status: editar.status })
          }
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
            resolve({ data: clientes.data, mensaje: editar.mensaje, status: editar.status })
          });

        } catch (error) {
          db.rollback(function () {
            return reject(error)
          });
        }
      })

    })

  }

  eliminar(id) {
    return new Promise(async (resolve, reject) => {
      const sql = 'UPDATE clientes SET activo = 0 WHERE id_cli = ?';
      const eliminado = await new Promise((resolve, reject) => {
        db.query(sql, [id], function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.affectedRows == 0) {
            resolve({ mensaje: 'No se encontro el cliente', status: 404 })
            return
          }
          resolve({ mensaje: 'Cliente eliminado con exito', status: 200 })
        })
      })
      const clientes = await new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM clientes where activo = 1';
        db.query(sql, function (err, res) {
          if (err) {
            return reject({ mensaje: err, status: 500 })
          }
          if (res.length) {
            resolve({ data: res, status: 200 })
          } else {
            resolve({ data: res, status: 200 })
          }
        })
      })
      if (eliminado.status != 200) {
        return resolve({ data: clientes.data, mensaje: eliminado.mensaje, status: eliminado.status })
      }
      resolve({ data: clientes.data, mensaje: eliminado.mensaje, status: eliminado.status })
    })

  }
}


module.exports = new clientesM();