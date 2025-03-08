const express = require("express");
const router = express.Router();
const auditoriaClientesController = require("../../controllers/auditoria/auditoriaClientesController");

module.exports = () => {
  // Obtener todas las auditorias de clientes
  router.get("/", auditoriaClientesController.obtenerAuditoriaClientes);

  return router;
};
