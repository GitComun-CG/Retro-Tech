CREATE DATABASE  IF NOT EXISTS `ProyectoTech`;
USE `ProyectoTech`;

CREATE TABLE `anuncio` (
  `idAnuncio` int unsigned NOT NULL AUTO_INCREMENT,
  `idUsuarioVenta` int unsigned NOT NULL,
  `fechaPublicacion` date NOT NULL,
  `nombreAnuncio` varchar(50) NOT NULL,
  `descripcion` varchar(500) NOT NULL,
  `imagenAnuncio` blob,
  `precio` int NOT NULL,
  `ubicacionAnuncio` varchar(100) NOT NULL,
  `categoriaAnuncio` enum('Informatica','Consolas','Videojuegos','Accesorios','sonido') NOT NULL,
  PRIMARY KEY (`idAnuncio`),
  KEY `publicacion_idUsuarioVenta_fk1` (`idUsuarioVenta`),
  CONSTRAINT `publicacion_idUsuarioVenta_fk1` FOREIGN KEY (`idUsuarioVenta`) REFERENCES `usuario` (`idUsuario`)
);

CREATE TABLE `categoria` (
  `idCategoria` int unsigned NOT NULL AUTO_INCREMENT,
  `idAnuncio` int unsigned NOT NULL,
  `nombre` enum('Informatica','consolas','Videojuegos','Accesorios','sonido') NOT NULL,
  PRIMARY KEY (`idCategoria`),
  KEY `categoria_idAnuncio_fk1` (`idAnuncio`),
  CONSTRAINT `categoria_idAnuncio_fk1` FOREIGN KEY (`idAnuncio`) REFERENCES `anuncio` (`idAnuncio`)
);

	
CREATE TABLE `compra` (
  `idCompra` int unsigned NOT NULL AUTO_INCREMENT,
  `idAnuncio` int unsigned NOT NULL,
  `idUsuario` int unsigned NOT NULL,
  `fechaEntrega` date NOT NULL,
  `lugarEntrega` varchar(1000) NOT NULL,
  `reservado` bit NOT NULL,
  PRIMARY KEY (`idCompra`),
  KEY `compra_idAnuncio_fk1` (`idAnuncio`),
  KEY `compra_idUsuario_fk2` (`idUsuario`),
  CONSTRAINT `compra_idAnuncio_fk1` FOREIGN KEY (`idAnuncio`) REFERENCES `anuncio` (`idAnuncio`),
  CONSTRAINT `compra_idUsuario_fk2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`)
);



CREATE TABLE `usuario` (
  `idUsuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(60) NOT NULL,
  `apellido` varchar(60) NOT NULL,
  `apellido2` varchar(60) NOT NULL,
  `direccion` varchar(120) NOT NULL,
  `imagen` tinyblob,
  `pais` varchar(60) NOT NULL,
  `codigopostal` int NOT NULL,
  `contraseña` varchar(20) NOT NULL,
  `correoElectronico` varchar(50) NOT NULL,
  `nombreUsuario` varchar(50) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `nombreUsuario` (`nombreUsuario`)
);