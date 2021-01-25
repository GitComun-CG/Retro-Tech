const getDB = require("../../db");

const resetearContrasena = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacar los campos recuperarContraseña y nuevaContraseña
    const { codigoRecuperacion, nuevaContraseña } = req.body;

    // Si alguno de eso campos está vacío, dar un error
    if (!codigoRecuperacion || !nuevaContraseña) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    // Comprobar que existe un usuario en la base de datos con ese código de recuperación activo
    const [usuario] = await connection.query(
      `
    SELECT idUsuario FROM usuarios WHERE codigoRecuperacion=?`,
      [codigoRecuperacion]
    );

    // Si no lo hay devuelve un error
    if (usuario.length === 0) {
      const error = new Error("Código de recuperación incorrecto.");
      error.httpStatus = 404;
      throw error;
    }
    // Establecer la contraseña proporcionada a ese usuario
    await connection.query(
      `
        UPDATE usuarios SET contraseña=SHA2(?, 512), ultimaActualizacion=?, codigoRecuperacion=NULL WHERE idUsuario=?`,
      [nuevaContraseña, new Date(), usuario[0].id]
    );
    // 🆘️ No se me borra el código de recuperación de la base de datos

    // Devolver una respuesta
    res.send({
      status: "ok",
      message: "Contraseña cambiada con éxito.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = resetearContrasena;
