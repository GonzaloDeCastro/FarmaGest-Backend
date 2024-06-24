const express = require("express");
const router = express.Router();
const sesionesRoutes = require("./sessionRoute.js");
const productosRoutes = require("./productosRoute.js");
const usuariosRoutes = require("./usuariosRoute.js");

router.use("/productos/", productosRoutes());
router.use("/usuarios/", usuariosRoutes());
router.use("/sesiones/", sesionesRoutes());

module.exports = router;
