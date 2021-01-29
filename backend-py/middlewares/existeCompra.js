const getDB = require("../db");

const existeCompra = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idCompra } = req.params;

    const [result] = await connection.query(
      `
            SELECT idCompra FROM compra WHERE idCompra=?`,
      [idCompra]
    );

    if (result.length === 0) {
      const error = new Error("No existe esta compra.");
      error.httpStatus = 404;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = existeCompra;
