const express = require("express");
const router = express.Router();
const proveedoresController = require("../controllers/proveedoresController");

module.exports = () => {
  // Obtener todos los proveedores
  router.get("/", proveedoresController.obtenerProveedores);

  // Agregar un nuevo proveedor
  router.post("/", proveedoresController.agregarProveedor);

  // Actualizar un proveedor existente
  router.put("/:id", proveedoresController.actualizarProveedor);

  // Eliminar un proveedor existente
  router.delete("/:id", proveedoresController.eliminarProveedor);

  return router;
};
