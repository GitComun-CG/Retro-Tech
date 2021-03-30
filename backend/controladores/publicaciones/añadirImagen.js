// SCRIPT PARA AÑADIR IMÁGENES A UN ANUNCIO
// - POST - /mis-anuncio/:idAnuncio/imagenes

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

    let imagenGuardada;
    const now = new Date();

    const images = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (const imageData of Object.values(req.files).slice(0, 5)) {
        // Guardar la imágen con el nombre del fichero:
        const imageFile = await guardarImagen(imageData);

        images.push(imageFile);
        // Meter una nueva entrada en la tabla 'fotos_anuncio':
        await connection.query(
          `
            INSERT INTO fotos_anuncio(fechaPublicacion, foto, idAnuncio)
            VALUES (?, ?, ?);`,
          [formatDateToDB(now), imageFile, idAnuncio]
        );

        // Para separar los nombres de las fotos:
        if (imagenGuardada === undefined) {
          imagenGuardada = imageFile;
        } else {
          imagenGuardada += ";" + imageFile;
        }
      }
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
