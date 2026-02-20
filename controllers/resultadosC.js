const resultadosM = require('../models/resultadosM')


class resultadosC {

  todos(){
    return new Promise((resolve, reject) => {
      resultadosM.todos()
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  crear(datos){
    return new Promise((resolve, reject) => {
      resultadosM.crear(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

}

module.exports = new resultadosC();