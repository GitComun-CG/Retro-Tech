// CREACIÓN DEL SERVIDOR

require("dotenv").config();

const express = require("express");
const cors = require("cors");
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
  mostrarUsuario,
  borrarUsuario,
  editarUsuario,
  editarContrasena,
  recuperarContrasena,
  resetearContrasena,
  listarMisAnuncios,
} = require("./controladores/usuarios");

// **************** CONTROLADORES COMPRA_VENTA
const {
  proponerCompra,
  marcarReservado,
  marcarVendido,
  borrarSolicitudCompra,
  listarMisReservas,
  listarSolicitudesCompra,
  valorarCompra,
} = require("./controladores/compra_venta");

// Middlewares:
const elAnuncioExiste = require("./middlewares/elAnuncioExiste");
const elUsuarioExiste = require("./middlewares/elUsuarioExiste");
const esUsuario = require("./middlewares/esUsuario");
const puedeEditar = require("./middlewares/puedeEditar");
const existeCompra = require("./middlewares/existeCompra");

const { PORT } = process.env;

// Crear la app de express:
const app = express();

// Cors para el Front:
app.use(cors());

// Logger:
app.use(morgan("dev"));
// Body parser (body en JSON):
app.use(bodyParser.json());
// Body parser (multipart form data <- subida de imágenes):
app.use(fileUpload());

//______________________________________________________________________________________________________________//

/* 
 RUTAS DE LA API PARA PUBLICACIONES:
                                    */

// 👍️ GET - /comprar  : devuelve los elementos de la tabla 'categorias'
app.get("/comprar", listarCategorias);

// 👍️ GET - /comprar/:idCategoria  : devuelve los anuncios relacionados con una categoría
app.get("/comprar/:idCategoria", listarAnuncios);

// 👍️ GET - /comprar/:idCategoria/:idAnuncio : muestra un anuncio
app.get("/comprar/:idCategoria/:idAnuncio", elAnuncioExiste, mostrarAnuncio);

// 👍️ POST - /subir  : para crear un anuncio (TOKEN)
app.post("/subir", esUsuario, crearAnuncio);

// 👍️ listar mis anuncios - GET - /mis-anuncios/:idAnuncio
app.get("/mis-anuncios/:idUsuario", esUsuario, listarMisAnuncios);

// 👍️ PUT - /mis-anuncios/:idAnuncio : para editar un anuncio (TOKEN)
app.put(
  "/mis-anuncios/:idAnuncio",
  esUsuario,
  elAnuncioExiste,
  puedeEditar,
  editarAnuncio
);

// 👍️ DELETE - /mis-anuncios/:idAnuncio  : para borrar un anuncio (TOKEN)
app.delete(
  "/mis-anuncios/:idAnuncio",
  esUsuario,
  elAnuncioExiste,
  puedeEditar,
  borrarAnuncio
);

// 👍️ - POST - /mis-anuncios/:idAnuncio/imagenes: para subir una foto a un anuncio (TOKEN)
app.post(
  "/mis-anuncios/:idAnuncio/imagenes",
  esUsuario,
  elAnuncioExiste,
  puedeEditar,
  añadirImagen
);

// 👍️ - DELETE - /mis-anuncios/:idAnuncio/imagenes/:idFotoAnuncio: para eliminar una foto de un anuncio (TOKEN)
app.delete(
  "/mis-anuncios/:idAnuncio/imagenes/:idFotoAnuncio",
  esUsuario,
  elAnuncioExiste,
  puedeEditar,
  borrarImagen
);

// _____________________________________________________________________________________________________________ //

/*
RUTAS DE LA API PARA USUARIOS
                            */

// 👍️ - POST - /usuarios   --->   crear un usuario nuevo
app.post("/usuarios", crearUsuario);

// 👍️ - GET - /usuarios/validar/:codigoValidacion   --->   validar un usuario registrado
app.get("/usuarios/validar/:codigoRegistro", validarUsuario);

// 👍️ - POST - /usuarios/login   --->   iniciar sesión
app.post("/usuarios/login", iniciarSesion);

// 👍️ - GET - /usuarios/:idUsuario   --->   mostrar indormación de usuario
app.get("/usuarios/:idUsuario", esUsuario, elUsuarioExiste, mostrarUsuario);

// 👍️ - DELETE - /usuarios/:idUsuario   --->   borrar un usuario
app.delete("/usuarios/:idUsuario", esUsuario, elUsuarioExiste, borrarUsuario);

// 🆘️ - PUT - /usuarios/:idUsuario  --->  editar un usuario
app.put("/usuarios/:idUsuario", esUsuario, elUsuarioExiste, editarUsuario);

// 👍️ - PUT - /usuarios/:idUsuario/contrasena  --->  editar la contraseña de un usuario
app.put(
  "/usuarios/:idUsuario/contrasena",
  esUsuario,
  elUsuarioExiste,
  editarContrasena
);

// 👍️ - POST - /usuarios/recuperar-contrasena  --->   envía un código de recuperación de contraseña a un email de usuario
app.post("/usuarios/recuperar-contrasena", recuperarContrasena);

// 👍️ - POST - /usuarios/resetear-contrasena   --->  cambiar la contraseña de usuario
app.post("/usuarios/resetear-contrasena", resetearContrasena);

// _________________________________________________________________________________________________________________________ //

/*
RUTAS DE LA API PARA COMPRA_VENTA
                                 */
// proponer compra
app.post(
  "/comprar/:idCategoria/:idAnuncio/proponer-compra",
  elAnuncioExiste,
  esUsuario,
  proponerCompra
);

// marcar reservado
app.put(
  "/mis-anuncios/:idAnuncio/solicitudes/:idCompra",
  existeCompra,
  marcarReservado
);

// marcar vendido
app.put(
  "/mis-anuncios/:idAnuncio/:idCompra/vendido",
  existeCompra,
  marcarVendido
);

// borrar solicitud de compra
app.delete(
  "/mis-anuncios/:idCompra/solicitudes",
  existeCompra,
  borrarSolicitudCompra
);

// listar mis reservas
app.get("/mis-reservas/:idUsuario", esUsuario, listarMisReservas);

// listar solicitudes compra
app.get("/mis-solicitudes/:idUsuario", esUsuario, listarSolicitudesCompra);

// valorar compra
app.post(
  "/valoracion/:idUsuario/:idCompra",
  existeCompra,
  esUsuario,
  valorarCompra
);

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
