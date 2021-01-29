// SCRIPT PARA SOLICITAR RESERVAR UN ANUNCIO
// - PUT - /comprar/:idAnuncio/reservar

// Editar tabla anuncio y cambiar reservado a 'true'
// Editar tabla compra indicando lugar y fecha de entrega y cambiando aceptada=true

const getDB = require("../../db");

const marcarReservado = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { lugarEntrega, horaEntrega } = req.body;
    const { idAnuncio, idCompra } = req.params;

    const [compra] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idCompra=?`,
      [idCompra]
    );

    if (compra.length === 0) {
      const error = new Error("No existe la solicitud de compra.");
      error.httpStatus = 404;
      throw error;
    }

    const [reservado] = await connection.query(
      `
      SELECT idAnuncio FROM anuncios WHERE idAnuncio=? AND reservado=true`,
      [idAnuncio]
    );

    // Cada producto solo puede ser reservado 1 vez:
    if (reservado.length != 0) {
      const error = new Error("El producto ya está reservado.");
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
      UPDATE compra SET lugarEntrega=?, horaEntrega=?, aceptada=true WHERE idCompra=?`,
      [lugarEntrega, horaEntrega, idCompra]
    );

    await connection.query(
      `
      UPDATE anuncios SET reservado=true WHERE idAnuncio=?`,
      [idAnuncio]
    );

    //

    res.send({
      status: "ok",
      data: {
        idCompra: idCompra,
        lugarEntrega,
        horaEntrega,
        idAnuncio,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = marcarReservado;
