// SCRIPT PARA EDITAR UN ANUNCIO
// - PUT - /edit/:idAnuncio

const getDB = require("../../db");
const { formatDateToDB } = require("../../helpers");
const editarAnuncio = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;

    // Comprobar que los datos mínimos vienen en el body:
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
        UPDATE anuncios SET fechaPublicacion=?, titulo=?, descripcion=?, precio=?, provincia=?, localidad=? WHERE idAnuncio=?;`,
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
