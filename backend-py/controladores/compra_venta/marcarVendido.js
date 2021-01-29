// SCRIPT PARA MARCAR UN ANUNCIO COMO VENDIDO:
// - PUT - /mis-anuncios/:idAnuncio/vendido

// FALTAN COSAS

// UPDATE Marcar campo vendido en anuncios
// Editar tabla anuncios, marcar vendido=true y editar tabla compra y marcar vendido=true
const getDB = require("../../db");

const marcarVendido = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio, idCompra } = req.params;

    // Si el anuncio no ha sido marcado como reservado no puede ser vendido
    const [reservado] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idCompra=? AND reservado=true`,
      [idCompra]
    );

    if (reservado.length === 0) {
      const error = new Error("El anuncio aún no ha sido reservado.");
      error.httpStatus = 403;
      throw error;
    } else {
      await connection.query(
        `
        UPDATE anuncios SET vendido=true WHERE idAnuncio=?`,
        [idAnuncio]
      );

      await connection.query(
        `
        UPDATE compra SET vendido=true WHERE idCompra=?`,
        [idCompra]
      );

      res.send({
        status: "ok",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = marcarVendido;
