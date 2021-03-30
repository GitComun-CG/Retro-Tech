// SCRIPT PARA EDITAR UN USUARIO

const getDB = require("../../db");

const {
  guardarImagen,
  generarCadenaAleatoria,
  enviarEmail,
  formatDateToDB,
} = require("../../helpers");

const editarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Cosas que puede editar un usuario:
    // userName, nombre, apellidos, foto, ciudad, pais, codigoPostal, fechaNacimiento, email

    // Sacar id de req.params:
    const { idUsuario } = req.params; // id del usuario que queremos editar

    // Sacar userName, nombre, apellidos, ciudad, pais, codigoPostal, fechaNacimiento, email de req.body
    const {
      userName,
      nombre,
      apellidos,
      ciudad,
      pais,
      codigoPostal,
      fechaNacimiento,
      email,
    } = req.body;

    // Comprobar que el usuario que queremos editar es el dueño del perfil
    if (req.userAuth.id !== Number(idUsuario)) {
      const error = new Error("No tienes permisos para editar este usuario.");
      error.httpStatus = 403;
      throw error;
    }

    // Sacar la información actual del usuario en la base de datos
    const [currentUser] = await connection.query(
      `
        SELECT userName, email FROM usuarios WHERE idUsuario=?`,
      [idUsuario]
    );

    // Si existe req.files y req.files.foto, procesar la foto
    if (req.files && req.files.foto) {
      const fotoUsuario = await guardarImagen(req.files.foto);

      await connection.query(
        `
        UPDATE usuarios SET foto=? WHERE idUsuario=?`,
        [fotoUsuario, idUsuario]
      );
    }

    // Si el email enviado es diferente al de la base de datos, procesar el nuevo email
    if (email && email !== currentUser[0].email) {
      // Comprobar que no exista ya ese email en la base de datos:
      const [elEmailExiste] = await connection.query(
        `
            SELECT idUsuario FROM usuarios WHERE email=?`,
        [email]
      );

      if (elEmailExiste.length > 0) {
        const error = new Error("Ya existe una cuenta con ese email.");
        error.httpStatus = 409;
        throw error;
      }

      // Crear código de registro para hacer la validación:
      const codigoRegistro = generarCadenaAleatoria(40);
      const now = new Date();
      // Mandar un email al usuario con el link de confirmación del email
      const emailBody = `
        Acabas de modificar tu email en RetroTech. 
        Pulsa este link para validar tu nuevo email: ${process.env.PUBLIC_HOST}/usuarios/validar/${codigoRegistro}`;

      await enviarEmail({
        to: email,
        subject: "Confirma tu nuevo email.",
        body: emailBody,
      });

      // Actualizar los datos finales
      await connection.query(
        `
        UPDATE usuarios SET userName=?, nombre=?, apellidos=?, ciudad=?, pais=?, codigoPostal=?, fechaNacimiento=?, email=?, active=0, codigoRegistro=?, ultimaActualizacion=? WHERE idUsuario=?`,
        [
          userName,
          nombre,
          apellidos,
          ciudad,
          pais,
          codigoPostal,
          fechaNacimiento,
          email,
          codigoRegistro,
          formatDateToDB(now),
          idUsuario,
        ]
      );
      // Dar una respuesta si cambia el email:
      res.send({
        status: "ok",
        message:
          "Has actualizado tu perfil con éxito. Pronto recibirás un mensaje para validar tu nuevo email.",
      });
      // Dar una respuesta si no cambia el email:
    } else {
      await connection.query(
        `
            UPDATE usuarios SET nombre=?, apellidos=?, ciudad=?, pais=?, codigoPostal=?, fechaNacimiento=? WHERE idUsuario=?`,
        [
          nombre,
          apellidos,
          ciudad,
          pais,
          codigoPostal,
          fechaNacimiento,
          idUsuario,
        ]
      );
      res.send({
        status: "ok",
        message: "Datos de usuario actualizados.",
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editarUsuario;
