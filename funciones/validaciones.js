
function camposRequeridos(data) {
  const campos = Object.values(data)
  for (let i = 0; i < campos.length; i++) {
    if (!campos[i] || String(campos[i]).trim() == '') {
      return { mensaje: 'Todos los campos son requeridos', resultado: false }
    }
  }
  return { mensaje: 'Campos completos', resultado: true }
}

module.exports = {
  camposRequeridos
}