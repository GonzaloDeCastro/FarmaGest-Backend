const express = require("express");
const router = express.Router();
const clientesController = require("../controllers/clientesController");

module.exports = () => {
  // Obtener todos los clientes
  router.get("/", clientesController.obtenerClientes);

  // Agregar un nuevo cliente
  router.post("/", clientesController.agregarCliente);

  // Actualizar un cliente existente
  router.put("/:id", clientesController.actualizarCliente);

  // Eliminar un cliente existente
  router.put("/delete/:id", clientesController.eliminarCliente);

  // Obtener todas las obras sociales
  router.get("/ciudades", clientesController.obtenerCiudades);

  // Obtener todas las ciudades
  router.get("/obras-sociales", clientesController.obtenerObrasSociales);

  return router;
};
