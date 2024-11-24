const express = require("express");
const router = express.Router();
const reportesController = require("../controllers/reportesController");

module.exports = () => {
  // Obtener todas las ventas
  router.get("/", reportesController.obtenerTodasLasVentas);

  return router;
};
