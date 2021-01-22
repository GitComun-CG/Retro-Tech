const getDB = require("../db");

const puedeEditar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio } = req.params;

    // Seleccionar el anuncio de la base de datos para saber quien la creó:
    const [current] = await connection.query(
      `
      SELECT idUsuario FROM anuncios WHERE idAnuncio=?`,
      [idAnuncio]
    );
    // Comprobar que la id de usuario que la creó es la misma que la que viene en el token:
    if (
      current[0].idUsuario !== req.userAuth.id &&
      req.userAuth.rol !== "admin"
    ) {
      const error = new Error("No tienes permiso para editar este anuncio.");
      error.httpStatus = 401;
      throw error;
    }

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = puedeEditar;
