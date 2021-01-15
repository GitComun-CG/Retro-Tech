// Aquí creamos diferentes funciones para usar en determinadas cosas

// Para el cambio de formato de fecha:
const { format } = require("date-fns");

// Para editar fotos:
const sharp = require("sharp");
// Para generar nombres únicos para las fotos subidas:
const uuid = require("uuid");

// Para asegurar que existe un directorio:
const { ensureDir } = require("fs-extra");

const path = require("path");

// imageData es el objeto con información de la imagen.
const { UPLOADS_DIRECTORY } = process.env;

const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

//

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

module.exports = {
  formatDateToDB,
  guardarImagen,
};
