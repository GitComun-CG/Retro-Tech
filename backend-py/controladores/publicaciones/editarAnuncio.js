// SCRIPT PARA EDITAR UN ANUNCIO
// - PUT - /edit/:idAnuncio

const getDB = require("../../db");
const { formatDateToDB } = require("../../helpers");
const editarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;
    // Comprobar que existe el anuncio con ese id:
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
    // Comprobar que los datos mínimos vienen en el body:
    // 🆘️ ¿Debería llevar también los campos idCategoria e idUsuario?
    const {
      fechaPublicacion,
      titulo,
      descripcion,
      precio,
      provincia,
      localidad,
    } = req.body;

    if (
      !fechaPublicacion ||
      !titulo ||
      !descripcion ||
      !precio ||
      !provincia ||
      !localidad
    ) {
      const error = new Error("Faltan campos por cubrir.");
      error.httpStatus = 400;
      throw error;
    }

    const dbDate = new Date(fechaPublicacion);

    // Hacer la query de UPDATE:
    await connection.query(
      `
        UPDATE anuncios SET fechaPublicacion=?, titulo=?, descripcion=?, precio=?, provincia=?, localidad=? WHERE idAnuncio=?`,
      [
        formatDateToDB(dbDate),
        titulo,
        descripcion,
        precio,
        provincia,
        localidad,
        idAnuncio,
      ]
    );
    // Devolver una respuesta:

    res.send({
      status: "ok",
      data: {
        fechaPublicacion,
        titulo,
        descripcion,
        precio,
        provincia,
        localidad,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editarAnuncio;
