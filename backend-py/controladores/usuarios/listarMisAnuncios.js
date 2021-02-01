// Funciona pero mal (da un 200 pero no muestra el array de anuncios de ese usuario)

// - GET - /mis-anuncios/:idUsuario
const getDB = require("../../db");

const listarMisAnuncios = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario } = req.params;

    const [anuncios] = await connection.query(
      `SELECT  * FROM anuncios
       WHERE anuncios.idUsuario=? AND anuncios.vendido = false;`,
      [idUsuario]
    );

    res.send({
      status: "ok",
      data: {
        idUsuario: idUsuario,
        anuncios: anuncios,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarMisAnuncios;
