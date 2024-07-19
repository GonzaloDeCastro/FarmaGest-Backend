// routes/usuariosRoutes.js

const express = require("express");
const router = express.Router();
const usuariosController = require("../controllers/usuariosController");

module.exports = () => {
  // Obtener todos los usuarios
  router.get("/", usuariosController.obtenerUsuarios);
  router.get("/roles", usuariosController.obtenerRoles);
  router.get("/login", usuariosController.validarUsuarioLogin);

  // Agregar un nuevo usuario
  router.post("/", usuariosController.agregarUsuario);

  // Actualizar un usuario existente
  router.put("/:id", usuariosController.actualizarUsuario);

  // Eliminar un usuario existente
  router.delete("/:id", usuariosController.eliminarUsuario);

  return router;
};
