//

const getDB = require("../../db");

const contactar = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idUsuario, idAnuncio } = req.params;

    const [result] = await connection.query(`
        INSERT INTO `);
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = contactar;
