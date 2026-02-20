const ventasM = require('../models/ventasM')

class ventasC {

  ordenes(){
    return new Promise((resolve, reject) => {
      ventasM.ordenes()
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  crear(venta){
    return new Promise((resolve, reject) => {
      ventasM.crear(venta)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

}

module.exports = new ventasC();