const docoresM = require('../models/doctoresM')

class doctoresC {
  todos() {
    return new Promise((resolve, reject) => {
      docoresM.todos()
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  uno(especialidad) {
    return new Promise((resolve, reject) => {
      docoresM.uno(especialidad)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  crear(medico) {
    return new Promise((resolve, reject) => {
      docoresM.crear(medico)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  editar(medico, id) {
    return new Promise((resolve, reject) => {
      docoresM.editar(medico, id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(id) {
    return new Promise((resolve, reject) => {
      docoresM.eliminar(id)
        .then((res) => {
          resolve(res)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new doctoresC();