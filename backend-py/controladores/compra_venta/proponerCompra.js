// Insert en la tabla compra cubrir los campos idAnuncio, idUsuarioComprador, mensajeCompra

const getDB = require("../../db");

const proponerCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { mensajeCompra } = req.body;
    const { idAnuncio } = req.params;
    const idUsuarioComprador = req.userAuth.id;

    const [current] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idAnuncio=? AND idUsuarioComprador=?`,
      [idAnuncio, idUsuarioComprador]
    );

    if (current.length === 0) {
      const [result] = await connection.query(
        `
        INSERT INTO compra (idUsuarioComprador, idAnuncio, mensajeCompra) 
        VALUES (?, ?, ?)`,
        [idUsuarioComprador, idAnuncio, mensajeCompra]
      );

      const { insertId } = result;
      res.send({
        status: "ok",
        data: {
          idCompra: insertId,
          mensajeCompra,
          idUsuarioComprador,
          idAnuncio,
        },
      });
    } else {
      const error = new Error("Ya has reservado este anuncio.");
      error.httpStatus = 403;
      throw error;
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = proponerCompra;
