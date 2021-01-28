// SCRIPT PARA SOLICITAR RESERVAR UN ANUNCIO
// - POST - /comprar/:idAnuncio/reservar

const getDB = require("../../db");

const reservarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = reservarAnuncio;
