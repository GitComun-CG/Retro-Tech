// SCRIPT PARA COMPROBAR SI EXISTE UN ANUNCIO
const getDB = require("../db");

const elAnuncioExiste = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;

    const [result] = await connection.query(
      `
        SELECT idAnuncio FROM anuncios WHERE idAnuncio=?`,
      [idAnuncio]
    );

    if (result.length === 0) {
      const error = new Error("Anuncio no encontrado.");
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = elAnuncioExiste;
