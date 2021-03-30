// - GET - /mis-reservas/:idUsuario

// SELECT idCompra, idAnuncio, horaEntrega, lugarEntrega FROM compra WHERE aceptada=true AND idUsuario=?

const getDB = require("../../db");

const listarMisReservas = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.params;

    const [reservas] = await connection.query(
      `
        SELECT compra.idCompra, compra.idAnuncio, compra.aceptada, compra.vendido, usuarios.userName  
        FROM compra LEFT JOIN valoracionUsuario ON (valoracionUsuario.idCompra = compra.idCompra)
        INNER JOIN anuncios ON (anuncios.idAnuncio = compra.idAnuncio) 
        INNER JOIN usuarios ON (usuarios.idUsuario = anuncios.idUsuario) WHERE idUsuarioComprador=? 
        AND valoracionUsuario.idValoracion IS NULL`,
      [idUsuario]
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
