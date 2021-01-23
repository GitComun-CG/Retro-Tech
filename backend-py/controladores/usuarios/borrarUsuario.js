// SCRIPT PARA BORRAR / DESACTIVAR UN USUARIO

const getDB = require("../../db");

const borrarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacar el idUsuario que se quiere borrar de req.params:
    const { idUsuario } = req.params;

    // Si el idUsuario es igual a 1 (usuario admin en la base de datos), lanza error para que no se pueda borrar el admin:
    if (Number(idUsuario) === 1) {
      const error = new Error(
        "El administrador principal no puede ser eliminado."
      );
      error.httpStatus = 403;
      throw error;
    }
    // Si quien quiere borrar el usuario no es el dueño del perfil o un usuario admin, lanza un error:
    if (req.userAuth.id !== Number(idUsuario) && req.userAuth.rol !== "admin") {
      const error = new Error("No tienes permisos para borrar este usuario.");
      error.httpStatus = 401;
      throw error;
    }
    // Hacer un update de la tabla de usuarios:
    await connection.query(
      `
        DELETE FROM usuarios WHERE idUsuario=?`,
      [idUsuario]
    );
    // ¿Faltaría
    // Devolvemos una respuesta:
    res.send({
      status: "ok",
      message: `El usuario con id ${idUsuario} ha sido eliminado.`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release;
  }
};

module.exports = borrarUsuario;
