const getDB = require("../../db");
const { generarCadenaAleatoria, enviarEmail } = require("../../helpers");

const recuperarContrasena = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacar de req.body el email a donde enviar la información de cambio de contraseña:
    const { email } = req.body;
    // Si no hay email, da un error:
    if (!email) {
      const error = new Error("Faltan campos.");
      error.httpStatus = 400;
      throw error;
    }
    // Comprobar que el email existe en la base de datos y si no dar un error:
    const [currentEmail] = await connection.query(
      `
        SELECT idUsuario FROM usuarios WHERE email=?`,
      [email]
    );

    if (currentEmail.length === 0) {
      const error = new Error("No existe el email.");
      error.httpStatus = 404;
      throw error;
    }

    // Generar un código de recuperación:
    const codigoRecuperacion = generarCadenaAleatoria(20);

    // Mandar el código de recuperación por mail al usuario:
    const emailBody = `
        Has solicitado un cambio de contraseña. El código de recuperación es: ${codigoRecuperacion}.
        Si no has solicitado este cambio, por favor ignora este email.
        Gracias.`;

    await connection.query(
      `
            UPDATE usuarios SET codigoRecuperacion=? WHERE email=?`,
      [codigoRecuperacion, email]
    );
    // Enviar por mail el código de recuperación:
    await enviarEmail({
      to: email,
      subject: "Cambio de contraseña en RetroTech.",
      body: emailBody,
    });

    // Dar una respuesta:
    res.send({
      status: "ok",
      message: "Email enviado.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recuperarContrasena;
