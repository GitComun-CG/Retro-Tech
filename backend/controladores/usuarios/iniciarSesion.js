const getDB = require("../../db");
const jwt = require("jsonwebtoken");

const iniciarSesion = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recoger el email y contraseña de req.body:
    const { email, contraseña } = req.body;
    // Si email o contraseña están vacíos lanza un error:
    if (!email || !contraseña) {
      const error = new Error("Faltan campos.");
      error.httpStatus = 400;
      throw error;
    }
    // Seleccionar el usuario de la base de datos con ese email y contraseña:
    const [usuario] = await connection.query(
      `
        SELECT idUsuario, rol, active FROM usuarios WHERE email=? AND contraseña=SHA2(?, 512)
        `,
      [email, contraseña]
    );

    // Si no existe, envíamos un error de que email o contraseña son incorrectas:
    if (usuario.length === 0) {
      const error = new Error("Email o contraseña incorrecta.");
      error.httpStatus = 401;
      throw error;
    }
    // Si existe pero el usuario aún no ha sido validado mandar aviso de que está pendiente de validar:
    if (!usuario[0].active) {
      const error = new Error(
        "El usuario está pendiente de validar. Comprueba tu email y vuelve a intentarlo."
      );
      error.httpStatus = 401;
      throw error;
    }
    // Respuesta de inicio de sesión correcto:

    // Crear un objeto de información que irá en el token:
    const info = {
      id: usuario[0].idUsuario,
      rol: usuario[0].rol,
    };

    const token = jwt.sign(info, process.env.SECRET, {
      expiresIn: "30d",
    });

    res.send({
      status: "ok",
      data: { token },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = iniciarSesion;
