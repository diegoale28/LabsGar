const { clientes } = require('../database/data')
const { v4: uuidv4 } = require('uuid');


class clientesM {
  todos() {
    return new Promise((resolve, reject) => {
      if (clientes.length) {
        resolve({ data: clientes, mensaje: 'Consulta exitosa', status: 200 })
      } else {
        resolve({ data: clientes, mensaje: 'No hay clientes para mostrar', status: 200 })
      }
      if (!clientes) {
        reject({ mensaje: 'Error', status: 500 })
      }
    })

  }

  uno(id) {
    return new Promise((resolve, reject) => {
      let result = []
      const clinenteSeleccionado = clientes.find(c => c.id_cli == id)
      if (clinenteSeleccionado) {
        result = [clinenteSeleccionado]
      }
      if (result.length) {
        resolve({ data: result, mensaje: 'Consulta exitosa', status: 200 })
      } else {
        resolve({ data: result, mensaje: 'No se encontro el cliente', status: 200 })
      }
      if (!result === undefined) {
        reject({ mensaje: 'Error', status: 500 })
      }
    })

  }

  crear(cliente) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, cedula } = cliente
      const id = uuidv4();
      const clienteInsertar = {
        id_cli: id,
        nombre: nombre,
        apellido: apellido,
        cedula: cedula
      }
      clientes.push(clienteInsertar)
      resolve({ mensaje: 'Cliente insertado con exito', data: clienteInsertar, status: 201 })
    })

  }

  editar(cliente, id) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, cedula } = cliente
      const clienteEncontrado = clientes.findIndex(c => c.id_cli == id)
      const clienteEditado = {
        id_cli: Number(id),
        nombre: nombre,
        apellido: apellido,
        cedula: cedula
      }
      if (clienteEncontrado < 0) {
        resolve({ data: [], mensaje: 'No se encontro el cliente', status: 404 })
      } else {
        clientes.splice(clienteEncontrado, 1, clienteEditado)
        resolve({ data: clienteEditado, mensaje: 'Cliente editado con éxito', status: 200 })
      }
    })

  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      const clienteEncontrado = clientes.findIndex(c => c.id_cli == id)
      if (clienteEncontrado < 0) {
        resolve({ data: [], mensaje: 'No se encontro el cliente', status: 404 })
      } else {
        clientes.splice(clienteEncontrado, 1)
        resolve({ data: [], mensaje: 'Cliente eliminado con éxito', status: 200 })
      }
    })

  }
}


module.exports = new clientesM();