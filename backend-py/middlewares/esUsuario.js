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

    // Inyectar en la request la información del token:
    req.userAuth = tokenInfo;

    console.log(tokenInfo);

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = esUsuario;