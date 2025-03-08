const express = require("express");
const router = express.Router();
const auditoriaObrasSocialesController = require("../../controllers/auditoria/auditoriaObrasSocialesController");

module.exports = () => {
  // Obtener todas las auditorias de clientes
  router.get(
    "/",
    auditoriaObrasSocialesController.obtenerAuditoriaObrasSociales
  );

  return router;
};
