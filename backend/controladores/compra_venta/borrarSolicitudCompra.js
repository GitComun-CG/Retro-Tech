// Recibir idcompra borrarla y validar que existe la compra

// V - Crear un middleware de existeCompra y ponerlo a marcarReservado, marcarVendido, valorarCompra, borrarSolicitudCompra

// - DELETE - /mis-anuncios/:idCompra/solicitudes

const getDB = require("../../db");

const borrarSolicitudCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idCompra } = req.params;

    const [result] = await connection.query(
      `
      SELECT * FROM compra WHERE idCompra=?`,
      [idCompra]
    );

    if (result[0].vendido === 1) {
      const error = new Error("El producto ya ha sido vendido.");
      throw error;
    }

    await connection.query(
      `
        DELETE FROM compra WHERE idCompra=?`,
      [idCompra]
    );

    res.send({
      status: "ok",
      message: `La solicitud de compra con id ${idCompra} ha sido borrada.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarSolicitudCompra;
