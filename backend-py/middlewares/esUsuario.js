// SCRIPT PARA COMPROBAR QUE EL USUARIO ES EL CORRECTO

const getDB = require("../db");
const jwt = require("jsonwebtoken");

const esUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { authorization } = req.headers;

    // Si 'authorization' está vacío, devuelve un error:
    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización.");
      error.httpStatus = 401;
      throw error;
    }
    // Validar el token y si no es válido devuelve un error:
    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET);
    } catch (e) {
      const error = new Error("El token no es válido.");
      error.httpStatus = 401;
      throw error;
    }

    // Comprobaciones de seguridad extras:
    // Seleccionar la última vez que el usuario cambió el email o la contraseña
    const [result] = await connection.query(
      `
      SELECT ultimaActualizacion FROM usuarios WHERE idUsuario=?`,
      [tokenInfo.id]
    );

    // Cambiar el formato de fecha de cambio de email o contraseña:
    const ultimaActualizacion = new Date(result[0]);

    const fechaEmisionToken = new Date(tokenInfo.iat * 1000);
    // Si el token fue emitido antes de la fecha de la nueva actualización, da error (habría que volver a logearse con el nuevo email o contraseña)
    if (fechaEmisionToken < ultimaActualizacion) {
      const error = new Error("El token no es válido.");
      error.httpStatus = 401;
      throw error;
    }

    // Inyectar en la request la información del token:
    req.userAuth = tokenInfo;

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = esUsuario;
