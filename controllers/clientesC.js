const clientesM = require('../models/clientesM')

class clientesC {
  todos() {
    return new Promise((resolve, reject) => {
      clientesM.todos()
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  uno(id) {
    return new Promise((resolve, reject) => {
      clientesM.uno(id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  crear(cliente) {
    return new Promise((resolve, reject) => {
      clientesM.crear(cliente)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  editar(cliente, id) {
    return new Promise((resolve, reject) => {
      clientesM.editar(cliente, id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      clientesM.eliminar(id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new clientesC();
