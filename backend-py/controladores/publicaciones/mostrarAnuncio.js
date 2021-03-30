//  SCRIPT PARA MOSTRAR UN ANUNCIO CON TODA SU INFORMACIÓN
// - GET - /comprar/:idCategoria/:idAnuncio

const getDB = require("../../db");

const mostrarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { idAnuncio } = req.params;
    const { idCategoria } = req.params;

    const [result] = await connection.query(
      `
        SELECT anuncios.idAnuncio, anuncios.fechaPublicacion, anuncios.titulo, anuncios.descripcion, anuncios.precio, anuncios.provincia, anuncios.localidad, anuncios.idCategoria, anuncios.idUsuario, usuarios.userName 
        FROM anuncios INNER JOIN usuarios ON (usuarios.idUsuario = anuncios.idUsuario)
        WHERE anuncios.idAnuncio=? AND anuncios.idCategoria=?;`,
      [idAnuncio, idCategoria]
    );

    if (result.length === 0) {
      const error = new Error(
        "El anuncio no existe para la categoría indicada."
      );
      error.httpStatus = 404;
      throw error;
    }

    const single = result;

    // Para mostrar las fotos que tiene el anuncio:
    const [fotos] = await connection.query(
      `
      SELECT idFotoAnuncio, foto, fechaPublicacion FROM fotos_anuncio WHERE idAnuncio=?;`,
      [idAnuncio]
    );

    // Saco la nueva media de votos
    const [puntuacionVendedor] = await connection.query(
      `
      SELECT AVG(valoracionUsuario.valoracion) AS valoracion
      FROM valoracionUsuario 
      WHERE valoracionUsuario.idUsuarioVendedor=?
    `,
      [result[0].idUsuario]
    );

    res.send({
      status: "ok",
      data: [ ...single, fotos, puntuacionVendedor] ,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = mostrarAnuncio;
