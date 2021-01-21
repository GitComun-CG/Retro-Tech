// CREACIÓN DEL SERVIDOR

require("dotenv").config();

const express = require("express");

const morgan = require("morgan");

const bodyParser = require("body-parser");

// Para la subida de ficheros:
const fileUpload = require("express-fileupload");

// ************ CONTROLADORES DE PUBLICACIONES:
const {
  listarCategorias,
  listarAnuncios,
  crearAnuncio,
  editarAnuncio,
  mostrarAnuncio,
  borrarAnuncio,
  añadirImagen,
  borrarImagen,
} = require("./controladores/publicaciones");

// ************* CONTROLADORES DE USUARIOS ************
const {
  crearUsuario,
  validarUsuario,
  iniciarSesion,
} = require("./controladores/usuarios");

// Middlewares:
const elAnuncioExiste = require("./middlewares/elAnuncioExiste");
const esUsuario = require("./middlewares/esUsuario");

const { PORT } = process.env;

// Crear la app de express:
const app = express();

// Aplicación de middlewares:
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(fileUpload());

/* 
 RUTAS DE LA API PARA PUBLICACIONES:
                                    */

// 👍️ GET - /comprar  : devuelve los elementos de la tabla 'categorias'
app.get("/comprar", listarCategorias);

// 👍️ GET - /comprar/:idCategoria  : devuelve los anuncios relacionados con una categoría
app.get("/comprar/:idCategoria", listarAnuncios);

// 👍️ GET - comprar/:idCategoria/:idAnuncio : muestra un anuncio
app.get("/comprar/:idCategoria/:idAnuncio", elAnuncioExiste, mostrarAnuncio);

// 👍️ POST - /subir  : para crear un anuncio (TOKEN)
app.post("/subir", esUsuario, crearAnuncio);

// 👍️ PUT - /edit/:idAnuncio : para editar un anuncio (TOKEN)
app.put("/edit/:idAnuncio", esUsuario, elAnuncioExiste, editarAnuncio);

// 👍️ DELETE - /mis-anuncios/:idAnuncio  : para borrar un anuncio (TOKEN)
app.delete(
  "/mis-anuncios/:idAnuncio",
  esUsuario,
  elAnuncioExiste,
  borrarAnuncio
);

// ⭕️ Guardar anuncios (?)

// 🆘️ - POST - /mis-anuncios/:idAnuncio/imagenes: para subir una foto a un anuncio (TOKEN)
app.post("/mis-anuncios/:idAnuncio/imagenes", elAnuncioExiste, añadirImagen);

// 👍️ - DELETE - /mis-anuncios/:idAnuncio/imagenes/:idImagen: para eliminar una foto de un anuncio (TOKEN)
app.delete(
  "/mis-anuncios/:idAnuncio/imagenes/:idImagen",
  elAnuncioExiste,
  borrarImagen
);

/*
RUTAS DE LA API PARA USUARIOS
                            */
// 👍️ - POST - /usuarios
app.post("/usuarios", crearUsuario);

// 👍️ - GET - /usuarios/validar/:codigoValidacion
app.get("/usuarios/validar/:codigoRegistro", validarUsuario);

// 👍️ - POST - /usuarios/login
app.post("/usuarios/login", iniciarSesion);

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
