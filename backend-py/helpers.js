// Aquí creamos diferentes funciones para usar en determinadas cosas
// Carga de los módulos:

// - para el formato de la fecha:
const { format } = require("date-fns");

// - para editar fotos:
const sharp = require("sharp");

// - para generar nombres únicos para las fotos subidas:
const uuid = require("uuid");

// - para asegurar que existe un directorio:
const { ensureDir, unlink } = require("fs-extra");

const path = require("path");

// imageData es el objeto con información de la imagen.
const { UPLOADS_DIRECTORY } = process.env;

const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

// *******  PARA EL CAMBIO DE FORMATO DE FECHA:  *******
function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

// *******  PARA LA SUBIDA DE FOTOS:  *******
async function guardarImagen(imageData) {
  // Asegurarse de que el directorio de subida de imágenes exista con la función ensureDir de 'fs-extra':
  await ensureDir(uploadsDir);

  // Leer la imágen con sharp:
  const imagen = sharp(imageData.data);

  // Comprobar que la imágen no tenga un tamaño mayor a X píxeles de ancho:
  const imagenInfo = await imagen.metadata();

  // Si es mayor que ese tamaño, redimensionarla a ese tamaño:
  const anchoMaximo = 800;

  if (imagenInfo.width > anchoMaximo) {
    imagen.resize(anchoMaximo);
  }
  // Generar un nombre único para la imagen:
  const nombreImagenGuardada = `${uuid.v4()}.jpg`;

  // Guardar la imagen en el directorio de subida de imágenes:
  await imagen.toFile(path.join(uploadsDir, nombreImagenGuardada));

  // Devolver el nombre del fichero:
  return nombreImagenGuardada;
}

// *******  PARA BORRAR FOTOS:  *******
async function borrarImagen(imagen) {
  const imagenPath = path.join(uploadsDir, imagen);

  await unlink(imagenPath);
}

module.exports = {
  formatDateToDB,
  guardarImagen,
  borrarImagen,
};
