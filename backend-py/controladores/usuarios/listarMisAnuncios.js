// SELECT idAnuncio, idUsuario FROM anuncios WHERE idAnuncio=? AND idUsuario=?, [idAnuncio, idUsuario]

const getDB = require("../../db");

const listarMisAnuncios = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio, idUsuario } = req.params;

    const [result] = await connection.query(
      `
          SELECT anuncios.idAnuncio, anuncios.fechaPublicacion, anuncios.titulo, anuncios.descripcion, anuncios.precio, anuncios.provincia, anuncios.localidad, anuncios.idCategoria, anuncios.idUsuario 
          FROM anuncios LEFT JOIN usuarios ON (anuncios.idAnuncio = usuarios.idUsuario)
          WHERE anuncios.idAnuncio = ?;`,
      [idAnuncio, idUsuario]
    );

    res.send({
      status: "ok",
      data: {
        result,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarMisAnuncios;
