const express = require("express");
const router = express.Router();

const productosRoutes = require("./productosRoute.js");
const usuariosRoutes = require("./usuariosRoute.js");

router.use("/productos/", productosRoutes());
router.use("/usuarios/", usuariosRoutes());

module.exports = router;
