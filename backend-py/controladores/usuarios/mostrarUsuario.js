// SCRIPT PARA MOSTRAR EL PERFIL DE UN USUARIO:

const getDB = require("../../db");

const mostrarUsuario = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Sacar el id de usuario de req.params
    const { idUsuario } = req.params;
    // Sacar la información de usuario
    const [usuario] = await connection.query(
      `
        SELECT idUsuario, fechaRegistro, userName, nombre, apellidos, foto, ciudad, pais, codigoPostal, fechaNacimiento, email, rol FROM usuarios WHERE idUsuario=?`,
      [idUsuario]
    );
    // Creo la respuesta básica
    const infoUsuario = {
      userName: usuario[0].userName,
      foto: usuario[0].foto,
      ciudad: usuario[0].ciudad,
      pais: usuario[0].pais,
    };

    // Si el usuario solicitado coincide con el del token, añadir a la respuesta básica los datos privados
    if (
      usuario[0].idUsuario === req.userAuth.id ||
      req.userAuth.role === "admin"
    ) {
      (infoUsuario.fechaRegistro = usuario[0].fechaRegistro),
        (infoUsuario.userName = usuario[0].userName),
        (infoUsuario.nombre = usuario[0].nombre),
        (infoUsuario.apellidos = usuario[0].apellidos),
        (infoUsuario.foto = usuario[0].foto),
        (infoUsuario.ciudad = usuario[0].ciudad),
        (infoUsuario.pais = usuario[0].pais),
        (infoUsuario.codigoPostal = usuario[0].codigoPostal),
        (infoUsuario.fechaNacimiento = usuario[0].fechaNacimiento),
        (infoUsuario.email = usuario[0].email),
        (infoUsuario.rol = usuario[0].rol);
    }
    res.send({
      status: "ok",
      data: infoUsuario,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = mostrarUsuario;
