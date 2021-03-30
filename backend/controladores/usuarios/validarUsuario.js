const getDB = require("../../db");

const validarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { codigoRegistro } = req.params;

    // Comprobar que hay un usuario pendiente de validar con ese código
    const [usuario] = await connection.query(
      `
        SELECT idUsuario FROM usuarios WHERE codigoRegistro=?`,
      [codigoRegistro]
    );
    // si no lo hay, dar un error
    if (usuario.length === 0) {
      const error = new Error(
        "El usuario ya ha sido validado. No hay ningún usuario pendiente de validar con ese código."
      );
      error.httpStatus = 404;
      throw error;
    }
    // Activar el usuario y quirarle el codigo de registro
    await connection.query(
      `
        UPDATE usuarios SET active=true, codigoRegistro=NULL WHERE codigoRegistro=?`,
      [codigoRegistro]
    );

    // Devolver una respuesta
    res.send({
      status: "ok",
      message: "Has validado tu cuenta.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validarUsuario;
