const examenM = require('../models/examenM')

class examenC {

  todoInsumo() {
    return new Promise((resolve, reject) => {
      examenM.todoInsumo()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  unoInsumo(nombre) {
    return new Promise((resolve, reject) => {
      examenM.unoInsumo(nombre)
        .then((result) => {
          resolve(result)
        }).catch((err) => {

        });
    })

  }

  crearInsumo(insumo) {
    return new Promise((resolve, reject) => {
      examenM.crearInsumo(insumo)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  editarInsumo(insumo, id) {
    return new Promise((resolve, reject) => {
      examenM.editarInsumo(insumo, id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })

  }

  eliminarInsumo(id) {
    return new Promise((resolve, reject) => {
      examenM.eliminarInsumo(id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  todoExamen() {
    return new Promise((resolve, reject) => {
      examenM.todoExamen()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  unoExamen(nombre) {
    return new Promise(async (resolve, reject) => {
      examenM.unoExamen(nombre)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crearExamen(examen) {
    return new Promise(async (resolve, reject) => {
      examenM.crearExamen(examen)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editarExamen(examen, id) {
    return new Promise(async (resolve, reject) => {
      examenM.editarExamen(examen, id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminarExamen(id) {
    return new Promise(async (resolve, reject) => {
      examenM.eliminarExamen(id)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new examenC();