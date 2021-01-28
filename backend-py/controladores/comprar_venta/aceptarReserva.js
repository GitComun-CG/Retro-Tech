// SCRIPT PARA QUE EL USUARIO VENDEDOR ACEPTE LA RESERVA:
// - PUT - /mis-anuncios/:idAnuncio/reservar

const getDB = require("../../db");

const aceptarReserva = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = aceptarReserva;
