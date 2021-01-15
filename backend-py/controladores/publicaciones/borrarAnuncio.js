const getDB = require("../../db");
const { borrarFoto } = require("../../helpers");

const borrarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Comprobar que el anuncio existe y si no dar un 404:
    const { idAnuncio } = req.params;

    const [current] = await connection.query(
      `
        SELECT idAnuncio FROM anuncios WHERE idAnuncio=?`,
      [idAnuncio]
    );

    // Si no existe, devolver un 404:
    if (current.length === 0) {
      const error = new Error("La entrada seleccionada no existe.");
      error.httpStatus = 404;
      throw error;
    }

    // Seleccionar las fotos relacionadas y borrar los ficheros de disco:
    const [fotos] = await connection.query(
      `
        SELECT foto FROM fotos_anuncio WHERE idAnuncio=?`,
      [idAnuncio]
    );

    console.log(fotos);
    // Borrar las posibles fotos de la tabla 'fotos_anuncio'...:
    await connection.query(
      `
        DELETE FROM fotos_anuncio WHERE idAnuncio=?`,
      [idAnuncio]
    );

    // ...y del disco:
    for (const item of fotos) {
      await borrarFoto(item.foto);
    }
    // Borrar el anuncio de la tabla 'anuncios':
    await connection.query(
      `
        DELETE FROM anuncios WHERE idAnuncio=?`,
      [idAnuncio]
    );
    // Confirmar:

    res.send({
      status: "ok",
      message: `El anuncio con id ${idAnuncio} y todos sus elementos han sido eliminados.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarAnuncio;
