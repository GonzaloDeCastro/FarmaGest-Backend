const express = require("express");
const router = express.Router();
const obrasSocialesController = require("../controllers/obrasSocialesController");

module.exports = () => {
  // Obtener todas las obras sociales
  router.get("/", obrasSocialesController.obtenerObrasSociales);

  // Agregar una nueva obra social
  router.post("/", obrasSocialesController.agregarObraSocial);

  // Actualizar una obra social existente
  router.put("/:id", obrasSocialesController.actualizarObraSocial);

  // Eliminar una obra social existente
  router.put("/delete/:id", obrasSocialesController.eliminarObraSocial);

  return router;
};
