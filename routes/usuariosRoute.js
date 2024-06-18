const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController.js");

module.exports = () => {
  router.get("/all", usuariosController.obtenerTodos);
  router.get("/roles", usuariosController.obtenerRoles);
  router.get("/obras-sociales", usuariosController.obtenerObrasSociales);
  router.get("/:id", usuariosController.obtenerPorId);

  router.put("/:id", usuariosController.actualizar);

  router.post("/", usuariosController.crear);
  router.post("/rol", usuariosController.agregarUsuarioRol);
  router.post("/obra-social", usuariosController.agregarUsuarioOs);

  router.delete("/:id", usuariosController.eliminar);
  router.delete("/rol/:id", usuariosController.eliminarUsuarioRol);
  router.delete("/obra-social/:id", usuariosController.eliminarUsuarioOs);
  return router;
};
