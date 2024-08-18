const express = require("express");
const router = express.Router();
const ventasController = require("../controllers/ventasController");

module.exports = () => {
  // Crear una nueva venta con ítems
  router.post("/", ventasController.crearVenta);

  // Obtener una venta específica con ítems por ID
  router.get("/:id", ventasController.obtenerVentaPorId);
  // Obtener todas las ventas
  router.get("/", ventasController.obtenerTodasLasVentas);

  // Otros métodos permanecen iguales...

  return router;
};
