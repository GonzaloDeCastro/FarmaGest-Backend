const express = require("express");
const router = express.Router();
const sesionesRoutes = require("./sessionRoute.js");
const proveedoresRoutes = require("./proveedoresRoute.js");
const productosRoutes = require("./productosRoute.js");
const usuariosRoutes = require("./usuariosRoute.js");
const clientesRoutes = require("./clientesRoute.js");

router.use("/proveedores/", proveedoresRoutes());
router.use("/productos/", productosRoutes());
router.use("/usuarios/", usuariosRoutes());
router.use("/clientes/", clientesRoutes());

/* router.use("/sesiones/", sesionesRoutes()); */

module.exports = router;
