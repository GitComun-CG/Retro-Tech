// SCRIPT PARA MARCAR UN ANUNCIO COMO VENDIDO:
// - POST - /mis-anuncios/:idAnuncio/vendido

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
