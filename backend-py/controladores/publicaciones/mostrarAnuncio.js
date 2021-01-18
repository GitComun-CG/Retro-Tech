//  SCRIPT PARA MOSTRAR UN ANUNCIO CON TODA SU INFORMACIÓN
// - GET - /comprar/:idCategoria/:idAnuncio

// 🆘️ Funciona pero mal. Al poner en Postman http://localhost:3002/comprar/2/10 (por ejemplo) me lista sólo el anuncio con idAnuncio = 10, pero pasa olímpicamente de la categoría :(
// 🆘️ Tampoco muestra las fotos de ese anuncio en la lista de anuncios.
const getDB = require("../../db");

const mostrarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();
    const { idAnuncio } = req.params;
    const { idCategoria } = req.params;

    const [result] = await connection.query(
      `
        SELECT anuncios.idAnuncio, anuncios.fechaPublicacion, anuncios.titulo, anuncios.descripcion, anuncios.precio, anuncios.provincia, anuncios.localidad, anuncios.idCategoria, anuncios.idUsuario 
        FROM anuncios LEFT JOIN categorias ON (anuncios.idAnuncio = categorias.idCategoria)
        WHERE anuncios.idAnuncio = ?;`,
      [idAnuncio, idCategoria]
    );

    const single = result;

    // Para mostrar las fotos que tiene el anuncio:
    const [fotos] = await connection.query(
      `
      SELECT idFotoAnuncio, foto, fechaPublicacion FROM fotos_anuncio WHERE idAnuncio=?;`,
      [idAnuncio]
    );

    res.send({
      status: "ok",
      data: { ...single, fotos },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = mostrarAnuncio;
