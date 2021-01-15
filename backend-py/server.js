// CREACIÓN DEL SERVIDOR

require("dotenv").config();

const express = require("express");

const morgan = require("morgan");

const bodyParser = require("body-parser");

// Para la subida de ficheros:
const fileUpload = require("express-fileupload");

// Controladores:
const {
  listarCategorias,
  listarAnuncios,
  crearAnuncio,
  editarAnuncio,
  mostrarAnuncio,
} = require("./controladores/publicaciones");

const { PORT } = process.env;

// Crear la app de express:
const app = express();

// Aplicación de middlewares:
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(fileUpload());

// RUTAS DE LA API:

// 👍️ GET - /comprar  : devuelve los elementos de la tabla 'categorias'
app.get("/comprar", listarCategorias);

// 👍️ GET - /comprar/:idCategoria  : devuelve los anuncios relacionados con una categoría
app.get("/comprar/:idCategoria", listarAnuncios);

// ⭕️ 🆘️ GET - /comprar/:idAnuncio : muestra un anuncio.
// comprar/:idCategoria/:idAnuncio", mostrarAnuncio);
app.get("/comprar/:idCategoria/:idAnuncio", mostrarAnuncio);

// 👍️ POST - /subir  : para crear un anuncio
app.post("/subir", crearAnuncio);

// ⭕️ PUT - /edit/:idAnuncio
app.put("/edit/:idAnuncio", editarAnuncio);

// Crear middlewar de error:
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: error.message,
  });
});

// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: "error",
    message: "Not found",
  });
});

// Cargar los controladores:

// Iniciar el servidor:
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}.`);
});
