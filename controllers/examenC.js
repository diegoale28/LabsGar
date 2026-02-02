const examenM = require('../models/examenM')

class examenC {

  todos(){
    return new Promise((resolve, reject) => {
      examenM.todos()
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  uno(id){
    return new Promise((resolve, reject) => {
      examenM.uno(id)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  crear(examen){
    return new Promise((resolve, reject) => {
      examenM.crear(examen)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  precio(rango){
    return new Promise((resolve, reject) => {
      examenM.precio(rango)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  editar(examen, id){
    return new Promise((resolve, reject) => {
      examenM.editar(examen, id)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  eliminar(id){
    return new Promise((resolve, reject) => {
      examenM.eliminar(id)
      .then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      });
    })
  }

}

module.exports = new examenC();