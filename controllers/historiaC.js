const historiaM = require('../models/historiaM')


class historiasC {
  todos() {
    return new Promise((resolve, reject) => {
      historiaM.todos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  uno(cedula) {
    return new Promise((resolve, reject) => {
      historiaM.uno(cedula)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }
 
  detalle(id) {
    return new Promise((resolve, reject) => {
      historiaM.detalle(id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}


module.exports = new historiasC();