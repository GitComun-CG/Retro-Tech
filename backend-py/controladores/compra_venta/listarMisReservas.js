// - GET - /mis-reservas/:idCompra

// SELECT idCompra, idAnuncio, horaEntrega, lugarEntrega FROM compra WHERE aceptada=true AND idUsuario=?

const getDB = require("../../db");

const listarMisReservas = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { horaEntrega, lugarEntrega } = req.params;

    const [reservas] = await connection.query(
      `
        SELECT idCompra, idAnuncio, horaEntrega, lugarEntrega FROM compra WHERE horaEntrega=? AND lugarEntrega=? AND aceptada=true`,
      [horaEntrega, lugarEntrega]
    );

    if (reservas === 0) {
      const error = new Error("No has reservado este anuncio.");
      error.httpStatus = 403;
      throw error;
    }

    res.send({
      status: "ok",
      data: reservas,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarMisReservas;
