// SCRIPT PARA COMPROBAR QUE EL USUARIO EXISTE

const getDB = require("../db");

const elUsuarioExiste = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.params;

    const [result] = await connection.query(
      `
            SELECT idUsuario FROM usuarios WHERE idUsuario=?`,
      [idUsuario]
    );

    if (result.length === 0) {
      const error = new Error("Usuario no encontrado.");
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = elUsuarioExiste;
