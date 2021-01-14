// Aquí creamos diferentes funciones para usar en determinadas cosas

// Para el cambio de formato de fecha:
const { format } = require("date-fns");

function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

module.exports = {
  formatDateToDB,
};
