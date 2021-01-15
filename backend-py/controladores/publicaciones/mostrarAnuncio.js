// SCRIPT PARA MOSTRAR UN ANUNCIO CON TODA SU INFORMACIÓN
// - GET - /comprar/:idCategoria/:idAnuncio

// ESTE NO LOS SE HACER

// const getDB = require("../../db");

// const mostrarAnuncio = async (req, res, next) => {
//   let connection;

//   try {
//     connection = await getDB();

//     const { idAnuncio } = req.params;
//     // console.log(idAnuncio);
//     res.send({
//       message: "Muestra un anuncio.",
//     });
//   } catch (error) {
//     next(error);
//   } finally {
//     if (connection) connection.release();
//   }
// };

// module.exports = mostrarAnuncio;
