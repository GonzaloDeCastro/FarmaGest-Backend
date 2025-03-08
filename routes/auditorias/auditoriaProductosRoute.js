const express = require("express");
const router = express.Router();
const auditoriaProductosController = require("../../controllers/auditoria/auditoriaProductosController");

module.exports = () => {
  // Obtener todas las auditorias de productos
  router.get("/", auditoriaProductosController.obtenerAuditoriaProductos);

  return router;
};
