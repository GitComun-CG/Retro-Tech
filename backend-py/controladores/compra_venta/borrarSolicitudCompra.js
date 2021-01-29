// Recibir idcompra borrarla y validar que existe la compra

// V - Crear un middleware de existeCompra y ponerlo a marcarReservado, marcarVendido, valorarCompra, borrarSolicitudCompra

// - DELETE - /mis-anuncios/:idAnuncio/solicitudes

const getDB = require("../../db");

const borrarSolicitudCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idCompra, idUsuarioComprador, idAnuncio } = req.params;

    const [solicitud] = await connection.query(
      `
        SELECT idCompra FROM compra WHERE idUsuarioComprador=? AND idAnuncio=?
        `,
      [idUsuarioComprador, idAnuncio]
    );
    if (solicitud === 1) {
      await connection.query(
        `
            DELETE FROM compra WHERE idCompra=? AND idAnuncio=? AND idUsuarioComprador=?`,
        [idCompra, idAnuncio, idUsuarioComprador]
      );

      res.send({
        status: "ok",
        message: "La solicitud ha sido borrada.",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarSolicitudCompra;
