// SCRIPT PARA REGISTRAR UN NUEVO USUARIO
// - POST - /usuarios
// 🆘️🆘️🆘️ Cuando intento añadir un usuario me lanza el error de la línea 97 de /helpers. Si el usuario existe si que funciona y lanza el error correcto. No entiendo nada.
const getDB = require("../../db");
const {
  generarCadenaAleatoria,
  enviarEmail,
  formatDateToDB,
} = require("../../helpers");

const crearUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recojo de req.body los campos obligatorios

    const {
      userName,
      nombre,
      apellidos,
      ciudad,
      pais,
      codigoPostal,
      fechaNacimiento,
      email,
      contraseña,
    } = req.body;
    //MARCA
    // Compruebo que no estén vacíos
    if (
      !userName ||
      !nombre ||
      !apellidos ||
      !ciudad ||
      !pais ||
      !codigoPostal ||
      !fechaNacimiento ||
      !email ||
      !contraseña
    ) {
      const error = new Error("Faltan campos.");
      error.httpStatus = 400;
      throw error;
    }

    // Compruebo que no existe un usuario en la Base de Datos con ese email
    const [elUsuarioExiste] = await connection.query(
      `
        SELECT idUsuario FROM usuarios WHERE email=?
        `,
      [email]
    );

    if (elUsuarioExiste.length > 0) {
      const error = new Error("Ya existe una cuenta con este email.");
      error.httpStatus = 409;
      throw error;
    }

    // Creo un código de registro de 40 caracteres (contraseña temporal de un solo uso)

    const codigoRegistro = generarCadenaAleatoria(40);

    const now = new Date();
    // Mandar un email al usuario con el link de confirmación de email
    const emailBody = `
        ¡Gracias por registrarte en RetroTech! 
        Por favor, pulsa en el siguiente link para validar tu cuenta:
        ${process.env.PUBLIC_HOST}/usuarios/validar/${codigoRegistro}`;

    await enviarEmail({
      to: email,
      subject: "Activa tu cuenta en RetroTech.",
      body: emailBody,
    });

    // Introducir el usuario en la Base de Datos. Desactivado y con ese código de registro
    await connection.query(
      `
        INSERT INTO usuarios (fechaRegistro, userName, nombre, apellidos, ciudad, pais, codigoPostal, fechaNacimiento, email, contraseña, codigoRegistro)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, SHA2(?,512), ?)`,
      [
        formatDateToDB(now),
        userName,
        nombre,
        apellidos,
        ciudad,
        pais,
        codigoPostal,
        fechaNacimiento,
        email,
        contraseña,
        codigoRegistro,
      ]
    );
    // Mandar una respuesta
    res.send({
      status: "ok",
      message: "Crear nuevo usuario.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = crearUsuario;
