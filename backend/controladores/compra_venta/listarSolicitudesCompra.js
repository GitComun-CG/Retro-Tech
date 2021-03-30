// SELECT * de la tabla compra where idAnuncio
// /mis-solicitudes/:idUsuario
const getDB = require("../../db");

const listarSolicitudesCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.params;

    const [result] = await connection.query(
      `
        SELECT compra.idCompra, compra.idUsuarioComprador, compra.idAnuncio, compra.mensajeCompra, compra.aceptada, compra.vendido, usuarios.userName AS comprador
        FROM compra INNER JOIN anuncios ON (anuncios.idAnuncio = compra.idAnuncio) INNER JOIN usuarios ON (usuarios.idUsuario = compra.idUsuarioComprador) 
        WHERE anuncios.idUsuario=? AND anuncios.vendido=0`,
      [idUsuario]
    );

    res.send({
      status: "ok",
      data: result,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarSolicitudesCompra;
