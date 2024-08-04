const express = require("express");
const router = express.Router();
const proveedoresRoutes = require("./proveedoresRoute.js");
const productosRoutes = require("./productosRoute.js");
const usuariosRoutes = require("./usuariosRoute.js");
const clientesRoutes = require("./clientesRoute.js");
const obrasSocialesRoutes = require("./obrasSocialesRoute.js");

router.use("/proveedores/", proveedoresRoutes());
router.use("/productos/", productosRoutes());
router.use("/usuarios/", usuariosRoutes());
router.use("/clientes/", clientesRoutes());
router.use("/obras-sociales/", obrasSocialesRoutes());

/* router.use("/sesiones/", sesionesRoutes()); */

module.exports = router;
