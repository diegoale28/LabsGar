const ordenesM = require('../models/ordenesM')

class ordenesC {

  todos() {
    return new Promise((resolve, reject) => {
      ordenesM.todos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  uno(numero) {
    return new Promise((resolve, reject) => {
      ordenesM.uno(numero)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crear(orden) {
    return new Promise((resolve, reject) => {
      ordenesM.crear(orden)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(orden, id) {
    return new Promise((resolve, reject) => {
      ordenesM.editar(orden, id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      ordenesM.eliminar(id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new ordenesC();