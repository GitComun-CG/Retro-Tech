// SCRIPT PARA BORRAR IMÁGENES DE UN ANUNCIO:
// - DELETE - /mis-anuncios/:idAnuncio/imagenes/:idImagen
// 🆘️🆘️🆘️ LE DOY A BORRAR UNA FOTO QUE EXISTE Y ME DICE QUE LA FOTO NO EXISTE.
const getDB = require("../../db");
const { borrarImagen } = require("../../helpers");

const borrarLaImagen = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio, idFotoAnuncio } = req.params;

    // Seleccionar la foto de la Base de Datos:
    const [current] = await connection.query(
      `
      SELECT foto FROM fotos_anuncio WHERE idFotoAnuncio=? AND idAnuncio=?;`,
      [idFotoAnuncio, idAnuncio]
    );

    // Si la foto no existe, lanza un 404:
    if (current.length === 0) {
      const error = new Error("La foto no existe.");
      error.httpStatus = 404;
      throw error;
    }

    // Borrar la foto del disco:
    await borrarImagen(current[0].foto);
    // Borrar la foto de la Base de Datos:
    await connection.query(
      `
      DELETE FROM fotos_anuncio WHERE idFotoAnuncio=? AND idAnuncio=?;`,
      [idFotoAnuncio, idAnuncio]
    );
    res.send({
      status: "ok",
      message: "La foto ha sido borrada.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = borrarLaImagen;
