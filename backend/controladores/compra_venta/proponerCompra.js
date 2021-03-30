// Insert en la tabla compra cubrir los campos idAnuncio, idUsuarioComprador, mensajeCompra
// SCRIPT PARA PERMITIR A UN USUARIO SOLICITAR LA RESERVA DE UN ARTÍCULO
// Un usuario manda una solicitud de reserva que el vendedor podra aceptar o no.
// - PUT - /comprar/:idAnuncio/:idUsuario/proponer-compra

const getDB = require("../../db");

const proponerCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacamos los campos necesarios:
    const { mensajeCompra } = req.body;
    const { idAnuncio } = req.params;
    const idUsuarioComprador = req.userAuth.id;

    // Crear la compra:
    const [current] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idAnuncio=? AND idUsuarioComprador=?`,
      [idAnuncio, idUsuarioComprador]
    );

    // Inserta los campos en la tabla compra:
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
