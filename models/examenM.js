const { examenesMedicos } = require('../database/data')
const { v4: uuidv4 } = require('uuid');

class examenM {

  todos() {
    return new Promise((resolve, reject) => {
      if (examenesMedicos.length) {
        resolve({ data: examenesMedicos, mensaje: 'Consulta exitosa', status: 200 })
      } else {
        resolve({ data: examenesMedicos, mensaje: 'No hay examenes para mostrar', status: 200 })
      }
      if (!examenesMedicos) {
        reject({ mensaje: 'Error', status: 500 })
      }
    })
  }

  uno(id) {
    return new Promise((resolve, reject) => {
      let result = []
      const examenSelecionado = examenesMedicos.find(e => e.id_examen == id)
      if (examenSelecionado) {
        result = [examenSelecionado]
      }
      if (result.length) {
        resolve({ data: result, mensaje: 'Consulta exitosa', status: 200 })
      } else {
        resolve({ data: result, mensaje: 'No se encontro el examen', status: 200 })
      }
      if (!result === undefined) {
        reject({ mensaje: 'Error', status: 500 })
      }
    })
  }

  crear(examen) {
    return new Promise((resolve, reject) => {
      const { codigo, descripcion, precio, categoria, tipo_muestra, tiempo_procesamiento, insumos_utilizados } = examen
      const examenInsertar = {
        id_examen: uuidv4(),
        codigo: codigo,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        tipo_muestra: tipo_muestra,
        tiempo_procesamiento: tiempo_procesamiento,
        insumos_utilizados: insumos_utilizados
      }
      examenesMedicos.push(examenInsertar)
      resolve({ mensaje: 'Examen insertado con exito', data: examenInsertar, status: 201 })
    })
  }

  precio(rango) {
    return new Promise((resolve, reject) => {
      const { desde, hasta } = rango
      const listaExamenes = examenesMedicos.filter(e => e.precio >= desde && e.precio <= hasta)
      resolve({ data: listaExamenes, mensaje: 'Consultada lista de examenes', status: 200 })
    })
  }

  editar(examen, id) {
    return new Promise((resolve, reject) => {
      const { codigo, descripcion, precio, categoria, tipo_muestra, tiempo_procesamiento, insumos_utilizados } = examen
      const examenEncontrado = examenesMedicos.findIndex(e => e.id_examen == id)
      const examenEditado = {
        id_examen: Number(id),
        codigo: codigo,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        tipo_muestra: tipo_muestra,
        tiempo_procesamiento: tiempo_procesamiento,
        insumos_utilizados: insumos_utilizados
      }
      if (examenEncontrado < 0) {
        resolve({ data: [], mensaje: 'No se encontro el examen', status: 404 })
      } else {
        examenesMedicos.splice(examenEncontrado, 1, examenEditado)
        resolve({ data: examenEditado, mensaje: 'Examen editado con éxito', status: 200 })
      }
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      const examenEncontrado = examenesMedicos.findIndex(e => e.id_examen == id)
      if (examenEncontrado < 0) {
        resolve({ data: [], mensaje: 'No se encontro el examen', status: 404 })
      } else {
        examenesMedicos.splice(examenEncontrado, 1)
        resolve({ data: [], mensaje: 'Examen eliminado con éxito', status: 200 })
      }
    })
  }

}

module.exports = new examenM();