// SCRIPT PARA BORRAR UN ANUNCIO
// - DELETE - /mis-anuncios/:idAnuncio
// Funciona al darle dos veces pero a la primera salta un error con el path: "The \"path\" argument must be of type string. Received undefined"

const getDB = require("../../db");
const { borrarImagen } = require("../../helpers");

const borrarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;

    // Seleccionar las fotos relacionadas y borrar los ficheros de disco:
    const [imagen] = await connection.query(
      `
        SELECT foto FROM fotos_anuncio WHERE idAnuncio=?;`,
      [idAnuncio]
    );

    // Borrar las posibles fotos de la tabla 'fotos_anuncio'...:
    await connection.query(
      `
        DELETE FROM fotos_anuncio WHERE idAnuncio=?;`,
      [idAnuncio]
    );

    // ...y del disco:
    for (const item of imagen) {
      await borrarImagen(item.foto);
    }

    // ❌️ Borrar los posibles guardados del anuncio (?):

    // Borrar el anuncio de la tabla 'anuncios':
    await connection.query(
      `
        DELETE FROM anuncios WHERE idAnuncio=?;`,
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
