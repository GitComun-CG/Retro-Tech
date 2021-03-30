// Para valorar compra  Insertar en la tabla valoracionesUsuario idCompra, idUsuario
// Validar que la compra esta marcada como vendida si no no se permite validar al usuario
// Comprobar que no existe una validacion de usuario para este idCompra
// POST - /valoracion/:idUsuario/:idCompra
const getDB = require("../../db");
const { formatDateToDB } = require("../../helpers");

const valorarCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recojo los parámetros
    const { idUsuarioVendedor, idCompra } = req.params;
    const { valoracion } = req.body;

    // compruebo que el valor de votos esté en rango
    if (valoracion < 1 || valoracion > 5) {
      const error = new Error("El voto debe estar entre 1 y 5");
      error.httpStatus = 400;
      throw error;
    }

    // Compruebo el usuario no es el creador de la entrada
    const [current] = await connection.query(
      `
      SELECT idUsuarioVendedor 
      FROM valoracionUsuario
      WHERE idUsuarioVendedor=?
    `,
      [idUsuarioVendedor]
    );

    if (current[0] === req.userAuth.id) {
      const error = new Error("No puedes votarte a ti mismo");
      error.httpStatus = 403;
      throw error;
    }

    // Compruebo que el usuario no votara anteriormente la entrada
    const [existeValoracion] = await connection.query(
      `
      SELECT idValoracion
      FROM valoracionUsuario
      WHERE idCompra=?
    `,
      [idCompra]
    );

    if (existeValoracion.length > 0) {
      const error = new Error("Ya votaste esta entrada anteriormente");
      error.httpStatus = 403;
      throw error;
    }

    const now = new Date();

    // Añado el voto a la tabla
    const [voto] = await connection.query(
      `
      INSERT INTO valoracionUsuario(fechaValoracion, idCompra, valoracion, idUsuarioVendedor)
      VALUES(?,?,?,?)
    `,
      [formatDateToDB(now), idCompra, valoracion, req.userAuth.id]
    );

    res.send({
      status: "ok",
      data: {
        votes: voto.insertedId,
        valoracion: valoracion,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = valorarCompra;
