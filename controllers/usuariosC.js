const usuariosM = require('../models/usuariosM')

class usuariosC {

  login(data) {
    return new Promise(async (resolve, reject) => {
      usuariosM.login(data)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  listaUsuarios() {
    return new Promise(async (resolve, reject) => {
      usuariosM.listaUsuarios()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  registrar(data) {
    return new Promise(async (resolve, reject) => {
      usuariosM.registrar(data)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  roles() {
    return new Promise(async (resolve, reject) => {
      usuariosM.roles()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new usuariosC();