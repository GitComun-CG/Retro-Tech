// Archivo para crear las tablas de la Base de Datos en Node
// Este script se va a encargar de borrar las tablas que hay en la base de datos y crearlas de nuevo vacías
// Carga de las librerías faker y lodash:
const faker = require("faker");
const { random } = require("lodash");
// Con esto nos comunicamos con la base de datos mediante el archivo db.js:
const getDB = require("./db");
// Importamos el formato de la fecha del archivo helpers.js:
const { formatDateToDB } = require("./helpers");
// poner ${formatDateToDB(now)} para hacer el cambio de fecha
// Esta función se va a encargar de hacer cosas en la base de datos:
let connection;
async function main() {
  try {
    connection = await getDB();

    //Para que nos borre las tablas (antes de volver a crearlas):
    await connection.query("DROP TABLE IF EXISTS valoracionUsuario");
    await connection.query("DROP TABLE IF EXISTS compra");
    await connection.query("DROP TABLE IF EXISTS fotos_anuncio");
    await connection.query("DROP TABLE IF EXISTS anuncios");
    await connection.query("DROP TABLE IF EXISTS usuarios");
    await connection.query("DROP TABLE IF EXISTS categorias");

    console.log("Tablas borradas.");

    // Creamos la tabla "usuarios":
    await connection.query(`
        CREATE TABLE usuarios (
            idUsuario INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            fechaRegistro DATETIME NOT NULL,
            userName VARCHAR(50) NOT NULL,
                -- para que no se pueda repetir el userName
                CONSTRAINT usuarios_userName_uq1 UNIQUE(userName),
            nombre VARCHAR(60) NOT NULL,
            apellidos VARCHAR(120) NOT NULL,
            foto VARCHAR(500),
            ciudad VARCHAR(200) NOT NULL,
            pais VARCHAR(200) NOT NULL,
            codigoPostal INT NOT NULL,
            fechaNacimiento DATE NOT NULL,
            email VARCHAR(100) NOT NULL,
                -- para que no se pueda repetir el email
                CONSTRAINT usuarios_email_uq2 UNIQUE(email),
            contraseña VARCHAR(500) NOT NULL,
            active BOOLEAN DEFAULT false,
            borrado BOOLEAN DEFAULT false,
            codigoRegistro VARCHAR(100),
            rol ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
            ultimaActualizacion DATETIME,
            codigoRecuperacion VARCHAR(100)
            );
        `);

    // Creamos la tabla "categorias"
    await connection.query(`
        CREATE TABLE categorias (
            idCategoria INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            nombre ENUM('Consolas y Videojuegos', 'Informática', 'Teléfonos', 'TV y Vídeo', 'Sonido') NOT NULL        
            );
        `);

    // Creamos la tabla "anuncios":
    await connection.query(`
        CREATE TABLE anuncios (
            idAnuncio INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            fechaPublicacion DATETIME NOT NULL,
            titulo VARCHAR(150) NOT NULL,
            descripcion VARCHAR(500) NOT NULL,
            precio DECIMAL(8, 2) DEFAULT 0.0 NOT NULL,
            provincia VARCHAR(300) NOT NULL,
            localidad VARCHAR(300) NOT NULL,
            idCategoria INT UNSIGNED NOT NULL,
              CONSTRAINT anuncios_idCategoria_fk1 
                FOREIGN KEY (idCategoria) REFERENCES categorias(idCategoria),   
            foto VARCHAR(500), 
            idUsuario INT UNSIGNED NOT NULL,
                CONSTRAINT anuncios_idUsuario_fk2
                    FOREIGN KEY (idUsuario) REFERENCES usuarios(idUsuario),
            reservado BOOLEAN DEFAULT false,
            vendido BOOLEAN DEFAULT false
            );
        `);

    // Creamos la tabla "fotos_anuncio":
    await connection.query(`
      CREATE TABLE fotos_anuncio (
          idFotoAnuncio INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
          fechaPublicacion DATETIME NOT NULL,
          foto VARCHAR(500) NOT NULL,
          idAnuncio INT UNSIGNED NOT NULL,
            CONSTRAINT fotos_anuncio_idAnuncio_fk2
              FOREIGN KEY (idAnuncio) REFERENCES anuncios(idAnuncio)
          );
      `);

    // Crear la tabla "compra":
    await connection.query(`
    CREATE TABLE compra (
      idCompra INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      idUsuarioComprador INT UNSIGNED NOT NULL, 
        CONSTRAINT compra_idUsuario_fk1
          FOREIGN KEY (idUsuarioComprador) REFERENCES usuarios(idUsuario),
      idAnuncio INT UNSIGNED NOT NULL, 
        CONSTRAINT compra_idAnuncio_fk2
          FOREIGN KEY (idAnuncio) REFERENCES anuncios(idAnuncio),
      mensajeCompra VARCHAR(500),
      aceptada BOOLEAN DEFAULT false,
      horaEntrega DATETIME,
      lugarEntrega VARCHAR(200),
      vendido BOOLEAN DEFAULT false
    );
  `);

    // Crear la tabla "valoracionUsuario":
    await connection.query(`
      CREATE TABLE valoracionUsuario (
        idValoracion INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
        fechaValoracion DATETIME NOT NULL,
        idUsuarioVendedor INT UNSIGNED NOT NULL,
          CONSTRAINT valoracionUsuario_idUsuarioVendedor_fk1
            FOREIGN KEY (idUsuarioVendedor) REFERENCES usuarios(idUsuario),
        idCompra INT UNSIGNED NOT NULL,
          CONSTRAINT valoracionUsuario_idCompra_fk2
            FOREIGN KEY (idCompra) REFERENCES compra(idCompra),
        valoracion TINYINT DEFAULT 0,
        CONSTRAINT valoracionUsuario_valoracion_ck1
            CHECK (valoracion >= 1 OR valoracion <= 5)
   );
 `);
    console.log("Tablas creadas.");
    // Ahora introducimos datos iniciales de prueba (con "faker" y "lodash"):

    // --- introducir un usuario administrador ---
    await connection.query(`
      INSERT INTO usuarios (fechaRegistro, userName, nombre, apellidos, ciudad, pais, codigoPostal, fechaNacimiento, email, contraseña, active, rol)
      VALUES ("${formatDateToDB(
        new Date()
      )}", "Proyecto_hab20", "Proyecto", "HAB", "A Coruña", "España", "15100", "1995-03-24", "proyecto.hab2020@gmail.com", SHA2("${
      process.env.ADMIN_PASSWORD
    }", 512), true, "admin");`);

    // DATOS DE PRUEBA TABLA "usuarios":
    const usuarios = 20;
    for (let i = 0; i < usuarios; i++) {
      // -- pasamos la fecha de formato js a formato SQL con "date-fns" y el archivo "helpers.js" ---
      const now = new Date();
      const userName = faker.internet.userName();
      const nombre = faker.name.firstName();
      const apellidos = faker.name.lastName();
      const ciudad = faker.address.city();
      const pais = faker.address.country();
      const cp = random(10000, 20000);
      const fechaNacimiento = faker.date.between(1950, 2003);
      const email = faker.internet.email();
      const contraseña = faker.internet.password();
      await connection.query(`
        INSERT INTO usuarios (fechaRegistro, userName, nombre, apellidos, ciudad, pais, codigoPostal, fechaNacimiento, email, contraseña, active)
            VALUES ("${formatDateToDB(
              now
            )}", "${userName}", "${nombre}", "${apellidos}", "${ciudad}", "${pais}", "${cp}","${formatDateToDB(
        fechaNacimiento
      )}", "${email}", SHA2("${contraseña}", 224), true)
        `);
    }
    console.log("Datos de prueba introducidos en la tabla 'usuarios'.");

    // DATOS DE PRUEBA TABLA "categorias":
    const categorias = 6;
    for (let i = 1; i < categorias; i++) {
      const nombres = [i];

      await connection.query(`
             INSERT INTO categorias (nombre)
                 VALUES ( "${nombres}")`);
    }

    console.log("Datos de prueba introducidos en la tabla 'categorias'.");

    // DATOS DE PRUEBA TABLA "anuncios":
    const anuncios = 30;
    for (let i = 0; i < anuncios; i++) {
      const now = new Date();
      const titulo = faker.commerce.productName();
      const descripcion = faker.commerce.productDescription();
      const precio = random(10, 10000);
      const provincia = faker.address.state();
      const localidad = faker.address.city();
      const idCategoria = random(1, 5);
      const idUsuario = random(2, usuarios + 1);

      await connection.query(`
            INSERT INTO anuncios (fechaPublicacion, titulo, descripcion, precio, provincia, localidad, idCategoria, idUsuario)
                VALUES ("${formatDateToDB(
                  now
                )}", "${titulo}", "${descripcion}", "${precio}", "${provincia}", "${localidad}", "${idCategoria}", "${idUsuario}")`);
    }
    console.log("Datos de prueba introducidos en la tabla 'anuncios'.");

    // DATOS DE PRUEBA TABLA "compra":
    const compra = 50;

    for (let i = 0; i < compra; i++) {
      const idUsuarioComprador = random(2, usuarios + 1);
      const idAnuncio = random(1, anuncios);

      await connection.query(`
        INSERT INTO compra (idUsuarioComprador, idAnuncio) 
        VALUES ("${idUsuarioComprador}", "${idAnuncio}")`);
    }

    console.log("Datos de prueba introducidos en la tabla 'compra'.");

    // // DATOS DE PRUEBA TABLA "valoracionUsuario":
    // const valoraciones = 50;

    // for (let i = 0; i < valoraciones; i++) {
    //   const now = new Date();
    //   const idUsuarioVendedor = random(2, usuarios + 1);
    //   const idCompra = random(1, compra);
    //   const valoracion = random(1, 5);

    //   await connection.query(`
    //     INSERT INTO valoracionUsuario (fechaValoracion, idUsuarioVendedor, idCompra, valoracion)
    //     VALUES ("${formatDateToDB(
    //       now
    //     )}", "${idUsuarioVendedor}", "${idCompra}", "${valoracion}")`);
    // }

    console.log(
      "Datos de prueba introducidos en la tabla 'valoracionUsuario'."
    );
  } catch (error) {
    console.error(error);
  } finally {
    // Libera la conexión
    if (connection) connection.release();
    process.exit();
  }
}
main();
