// SCRIPT PARA LISTAR LOS ANUNCIOS VENDIDOS POR EL USUARIO:
// - GET - /mis-anuncios/vendidos

const getDB = require("../../db");

const listarVendidos = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarVendidos;
