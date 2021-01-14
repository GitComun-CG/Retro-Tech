// CREACIÓN DEL SERVIDOR

require("dotenv").config();

const express = require("express");

const morgan = require("morgan");

// Controladores:
const {
  listarCategorias,
  listarAnuncios,
} = require("./controladores/publicaciones");

const { PORT } = process.env;

// Crear la app de express:
const app = express();

// Aplicación de middlewares:
app.use(morgan("dev"));

// RUTAS DE LA API:

// GET - /comprar : devuelve los elementos de la tabla 'categorias'
app.get("/comprar", listarCategorias);

// GET - /comprar/:idCategoria: devuelve los anuncios relacionados con una categoría
app.get("/comprar/:idCategoria", listarAnuncios);

// Crear middlewar de error:
app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: "error",
    message: "error.message",
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
