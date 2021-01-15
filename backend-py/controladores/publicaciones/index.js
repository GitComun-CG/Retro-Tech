// ARCHIVO PARA IMPORTAR-EXPORTAR LAS RUTAS

const listarCategorias = require("./listarCategorias");
const listarAnuncios = require("./listarAnuncios");
const crearAnuncio = require("./crearAnuncio");
const editarAnuncio = require("./editarAnuncio");
const mostrarAnuncio = require("./mostrarAnuncio");

module.exports = {
  listarCategorias,
  listarAnuncios,
  crearAnuncio,
  editarAnuncio,
  mostrarAnuncio,
};
