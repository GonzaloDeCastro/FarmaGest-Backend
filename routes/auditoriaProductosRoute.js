const express = require("express");
const router = express.Router();
const auditoriaProductosController = require("../controllers/auditoriaProductosController");

module.exports = () => {
  // Obtener todas las auditorias de productos
  router.get("/", auditoriaProductosController.obtenerAuditoriaProductos);

  return router;
};
