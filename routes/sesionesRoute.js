const express = require("express");
const router = express.Router();
const sesionesController = require("../controllers/sesionesController");

module.exports = () => {
  // Obtener todas las sesiones
  router.get("/", sesionesController.obtenerSesiones);

  return router;
};
