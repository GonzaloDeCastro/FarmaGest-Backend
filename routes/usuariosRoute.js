const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController.js");

module.exports = () => {
  router.get("/all", usuariosController.obtenerTodos);
  router.get("/:id", usuariosController.obtenerPorId);
  router.put("/:id", usuariosController.actualizar);
  router.post("/", usuariosController.crear);
  router.delete("/:id", usuariosController.eliminar);
  return router;
};
