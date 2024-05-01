const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController.js");

module.exports = () => {
  router.get("/all", productosController.obtenerTodos);
  router.get("/:id", productosController.obtenerPorId);
  router.post("/", productosController.crear);
  return router;
};
