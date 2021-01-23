// SCRIPT PARA LISTAR LAS CATEGORÍAS.
// - GET - /comprar
const getDB = require("../../db");

const listarCategorias = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Leer las categorías de la Base de Datos:
    const [results] = await connection.query(`
        SELECT idCategoria, nombre FROM categorias;
        `);

    // console.log(results);

    // Devolver un json con las categorías:
    res.send({
      status: "ok",
      data: results,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarCategorias;
