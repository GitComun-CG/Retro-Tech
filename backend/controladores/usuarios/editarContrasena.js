const getDB = require("../../db");

const editarContrasena = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recoger de req.params el id del usuario que quiere cambiar la contraseña
    const { idUsuario } = req.params;

    // Recoger de req.body la antigua contraseña y la nueva contraseña
    const { antiguaContrasena, nuevaContrasena } = req.body;

    if (!nuevaContrasena) {
      const error = new Error("Faltan campos.");
      error.httpStatus = 400;
      throw error;
    }
    // Comprobar que el usuario que viene del token es el mismo al que queremos cambiar la contraseña
    if (req.userAuth.id !== Number(idUsuario)) {
      const error = new Error(
        "No tienes permisos para cambiar la contraseña de este usuario."
      );
      error.httpStatus = 403;
      throw error;
    }
    // Comprobar que la contraseña antigua es correcta
    const [current] = await connection.query(
      `
      SELECT idUsuario FROM usuarios WHERE idUsuario=? AND contraseña=SHA2(?, 512)`,
      [idUsuario, antiguaContrasena]
    );

    if (current.length === 0) {
      const error = new Error("La contraseña antigua no es correcta.");
      error.httpStatus = 401;
      throw error;
    }
    // Guardar la nueva contraseña
    await connection.query(
      `
      UPDATE usuarios SET contraseña=SHA2(?, 512), ultimaActualizacion=? WHERE idUsuario=?`,
      [nuevaContrasena, new Date(), idUsuario]
    );

    res.send({
      status: "ok",
      message: "Contraseña cambiada.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editarContrasena;
