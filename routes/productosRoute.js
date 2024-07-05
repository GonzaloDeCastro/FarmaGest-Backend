// routes/productosRoutes.js

const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");

module.exports = () => {
  // Obtener todos los productos
  router.get("/", productosController.obtenerProductos);

  // Obtener todas las categorías
  router.get("/categorias", productosController.obtenerCategorias);

  // Agregar un nuevo producto
  router.post("/", productosController.agregarProducto);

  // Actualizar un producto existente
  router.put("/:id", productosController.actualizarProducto);

  // Eliminar un producto existente
  router.delete("/:id", productosController.eliminarProducto);

  return router;
};
