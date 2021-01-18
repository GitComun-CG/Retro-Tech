// SCRIPT PARA AÑADIR IMÁGENES A UN ANUNCIO
// - POST - /mis-anuncio/:idAnuncio/imagenes
// 🆘️🆘️🆘️ EL SCRIPT FUNCIONA (da un 200 si existe el anuncio y un 404 si no) PERO NO AÑADE LA FOTO
const getDB = require("../../db");
const { guardarImagen, formatDateToDB } = require("../../helpers");

const añadirImagen = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;

    // Para comprobar que hay espacio para más fotos (hemos puesto que como máximo puede haber 5, por lo que si ya hay 5 no se podrán añadir más)
    const [imagenesActuales] = await connection.query(
      `
        SELECT idFotoAnuncio FROM fotos_anuncio WHERE idAnuncio=?;`,
      [idAnuncio]
    );
    // Si el anuncio ya tiene 5 fotos, lanza error:
    if (imagenesActuales.length >= 5) {
      const error = new Error(
        "Has alcanzado el máximo de 5 fotos para este anuncio."
      );
      error.httpStatus = 403;
      throw error;
    }

    // 🆘️🆘️ ESTO NO VA:
    let imagenGuardada;

    if (req.files && req.files.foto) {
      // guardar la foto en disco
      imagenGuardada = await guardarImagen(req.files.foto);

      const now = new Date();
      // insertar la foto nueva a la tabla 'fotos_anuncio'
      await connection.query(
        `
        INSERT INTO fotos_anuncio(fechaPublicacion, foto, idAnuncio)
            VALUES (?, ?, ?);`,
        [formatDateToDB(now), imagenGuardada, idAnuncio]
      );
    }
    res.send({
      status: "ok",
      data: {
        foto: imagenGuardada,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = añadirImagen;
