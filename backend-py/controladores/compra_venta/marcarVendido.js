// SCRIPT PARA MARCAR UN ANUNCIO COMO VENDIDO:
// - POST - /mis-anuncios/:idAnuncio/vendido

// UPDATE Marcar campo vendido en anuncios
// Editar tabla anuncios, marcar vendido=true y editar tabla compra y marcar vendido=true
const getDB = require("../../db");

const marcarVendido = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = marcarVendido;
