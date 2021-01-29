// SCRIPT PARA MARCAR UN ANUNCIO COMO VENDIDO:
// - PUT - /mis-anuncios/:idAnuncio/:idCompra/vendido

// Mensaje para acordarme en el futuro: Este ha sido el primer endpoint que he hecho sin mirar en ningún sitio y ha funcionado a la primera. A dia 29 de enero de 2021, a las 21:00 puedo decir que SOY FELIZ.
// Soy el yo de las 21:00, pero ahora son las 21:35. valorarCompra.js no funciona. Conclusión: La felicidad es tan efímera como el pedo de una hormiga :(

// Editar tabla anuncios, marcar vendido=true y editar tabla compra y marcar vendido=true

const getDB = require("../../db");

const marcarVendido = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { idAnuncio, idCompra } = req.params;
    // Seleccionar el idCompra:
    const [compra] = await connection.query(
      `
      SELECT idCompra FROM compra WHERE idCompra=?`,
      [idCompra]
    );
    // Si la solicitud de compra no existe lanza error:
    if (compra.length === 0) {
      const error = new Error("No existe la solicitud de compra.");
      error.httpStatus = 404;
      throw error;
    }

    // Seleccionar el anuncio que está reservado:
    const [reservado] = await connection.query(
      `
      SELECT idAnuncio FROM anuncios WHERE idAnuncio=? AND reservado=true`,
      [idAnuncio]
    );

    // Cada producto solo puede ser marcado como reservado 1 vez:
    if (reservado.length === 0) {
      const error = new Error(
        "No se puede marcar como vendido porque aún no ha sido reservado."
      );
      error.httpStatus = 404;
      throw error;
    }

    // Marcar como vendido el anuncio:
    await connection.query(
      `
      UPDATE anuncios SET vendido=true WHERE idAnuncio=?`,
      [idAnuncio]
    );

    await connection.query(
      `
    UPDATE compra SET vendido=true WHERE idAnuncio=?
    `,
      [idAnuncio]
    );

    //

    res.send({
      status: "ok",
      data: {
        idCompra: idCompra,
        idAnuncio,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = marcarVendido;
