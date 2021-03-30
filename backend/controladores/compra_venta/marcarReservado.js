// SCRIPT RESERVAR UN ANUNCIO
// - PUT - /comprar/:idAnuncio/reservar  // /mis-anuncios/:idAnuncio/solicitudes/:idCompra

// Editar tabla anuncio y cambiar reservado a 'true'
// Editar tabla compra indicando lugar y fecha de entrega y cambiando aceptada=true

//mis-anuncios/2/solicitudes/5
const getDB = require("../../db");

const marcarReservado = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { lugarEntrega, horaEntrega } = req.body;
    const { idAnuncio, idCompra } = req.params;
    // Seleccionar el idCompra:
    const [compra] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idCompra=?`,
      [idCompra]
    );
    // Si la solicitud de compra no existe lanza error:
    if (compra.length === 0) {
      const error = new Error("No existe la solicitud de compra.");
      error.httpStatus = 404;
      throw error;
    }

    // Seleccionar el anuncio que está reservado:
    const [reservado] = await connection.query(
      `
      SELECT idAnuncio FROM anuncios WHERE idAnuncio=? AND reservado=true`,
      [idAnuncio]
    );

    // Cada producto solo puede ser marcado como reservado 1 vez:
    if (reservado.length != 0) {
      const error = new Error("El producto ya ha sido reservado.");
      error.httpStatus = 404;
      throw error;
    }
    // El comprador añade un lugar y hora de entrega
    await connection.query(
      `
      UPDATE compra SET lugarEntrega=?, horaEntrega=?, aceptada=true WHERE idCompra=?`,
      [lugarEntrega, horaEntrega, idCompra]
    );

    // Marcar como reservado el anuncio:
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
