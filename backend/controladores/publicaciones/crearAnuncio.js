// SCRIPT PARA CREAR UN ANUNCIO NUEVO Y PARA SUBIR UNA IMAGEN
// - POST - /subir

const getDB = require("../../db");
const { formatDateToDB, guardarImagen } = require("../../helpers");
// const { random } = require("lodash");

const crearAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const {
      titulo,
      descripcion,
      precio,
      provincia,
      localidad,
      idCategoria,
    } = req.body;

    // Si alguno de los campos obligatorios no existe, lanza error:
    if (
      !titulo ||
      !descripcion ||
      !precio ||
      !provincia ||
      !localidad ||
      !idCategoria
    ) {
      const error = new Error("Faltan campos por cubrir.");
      error.httpStatus = 400;
      throw error;
    }

    const now = new Date();

    // Para comprobar el token del usuario que crea el anuncio.
    const idUsuario = req.userAuth.id;

    const [result] = await connection.query(
      `
        INSERT INTO anuncios (fechaPublicacion, titulo, descripcion, precio, provincia, localidad, idUsuario, idCategoria)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        formatDateToDB(now),
        titulo,
        descripcion,
        precio,
        provincia,
        localidad,
        idUsuario,
        idCategoria,
      ]
    );
    // Sacar el id de la fila insertada
    const { insertId } = result;

    // Procesar las imágenes:
    const images = [];
    // Con .slice (0,5) limitamos la cantidad de fotos a 5.
    // Si hay imágenes...
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
          [formatDateToDB(now), imageFile, insertId]
        );
      }
    }

    // Devuelve un objeto que representa las filas que acabo de insertar en la Base de Datos:
    res.send({
      status: "ok",
      data: {
        idAnuncio: insertId,
        fechaPublicacion: now,
        titulo,
        descripcion,
        precio,
        provincia,
        localidad,
        idUsuario,
        idCategoria,
        images,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = crearAnuncio;
