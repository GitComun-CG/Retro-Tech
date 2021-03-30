// SCRIPT PARA LISTAR LOS ANUNCIOS PERTENECIENTES A UNA CATEGORÍA
// - GET - /comprar/:idCategoria

const getDB = require("../../db");

const listarAnuncios = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // 🆘️ DESPUÉS DE 50 millones de intentos creo que funciona: La intención es que se muestren todos los anuncios que pertenecen a una categoria (idCategoria) y ahora lo hace. Si en Postman pones http://localhost:3000/comprar/3, muestra todos los anuncios con idCategoria 3, que es "Teléfonos". De todas formas: PREGUNTAR SI SE HACE ASÍ PORQUE LO DUDO MUCHO (pero funcionar, FUNCIONA!)
    const { idCategoria } = req.params;

    const { search, precioMinimo, precioMaximo, localidad } = req.query;

    let results;

    // 🆘️ Esto es para buscar con el buscador. Si buscas una palabra, lista los anuncios que contienen esa palabra en el título o la descripción. Ha funcionado a la primera sin dar error asi que seguramente esté mal.
    if (search || precioMinimo || precioMaximo || localidad) {
      [results] = await connection.query(
        `
        SELECT anuncios.idAnuncio, anuncios.fechaPublicacion, anuncios.titulo, anuncios.descripcion, anuncios.precio, anuncios.provincia, anuncios.localidad, anuncios.idCategoria, anuncios.idUsuario FROM anuncios
        INNER JOIN categorias ON (anuncios.idCategoria = anuncios.idCategoria)
        WHERE (anuncios.titulo LIKE ? OR anuncios.descripcion LIKE ?) AND anuncios.precio >= ? AND anuncios.precio <= ? AND anuncios.localidad LIKE ? AND anuncios.vendido = false;`,
        [
          `%${search}%`,
          `%${search}%`,
          `${precioMinimo}`,
          `${precioMaximo}`,
          `%${localidad}%`,
        ]
      );
    } else {
      [results] = await connection.query(
        `
        SELECT  anuncios.idAnuncio, anuncios.fechaPublicacion, anuncios.titulo, anuncios.descripcion, anuncios.precio, anuncios.provincia, anuncios.localidad, anuncios.idCategoria, anuncios.foto, anuncios.idUsuario FROM anuncios
         WHERE anuncios.idCategoria = ? AND anuncios.vendido = false;`,
        [idCategoria]
      );
    }

    const anunciosFiltrados = results;

    if (anunciosFiltrados.idCategoria === null) {
      // Si no existe el idCategoria, lanza un error 404
      const error = new Error("Lo siento, la categoría no existe.");
      error.httpStatus = 404;
      throw error;
    }

    let resultadoConFotos = [];

    if (results.legth > 0) {
      const ids = results.map((result) => result.id);

      const [fotos] = await connection.query(`
        SELECT * FROM fotos_anuncio WHERE idAnuncio IN (${ids.join(",")})`);

      resultadoConFotos = results.map((result) => {
        const fotoResultado = fotos.filter(
          (foto) => foto.idAnuncio === result.idFotoAnuncio
        );

        return {
          ...result,
          fotos: fotoResultado,
        };
      });
    }

    res.send({
      status: "ok",
      data: [...anunciosFiltrados, resultadoConFotos],
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = listarAnuncios;
