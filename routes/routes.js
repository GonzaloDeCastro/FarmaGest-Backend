const express = require("express");
const router = express.Router();
const proveedoresRoutes = require("./proveedoresRoute.js");
const productosRoutes = require("./productosRoute.js");
const usuariosRoutes = require("./usuariosRoute.js");
const clientesRoutes = require("./clientesRoute.js");
const auditoriaProductosRoutes = require("./auditorias/auditoriaProductosRoute.js");
const auditoriaClientesRoutes = require("./auditorias/auditoriaClientesRoute.js");
const auditoriaObrasSocialesRoutes = require("./auditorias/auditoriaObrasSocialesRoute.js");
const obrasSocialesRoutes = require("./obrasSocialesRoute.js");
const ventasRoutes = require("./ventasRoute.js");
const reportesRoutes = require("./reportesRoute.js");
const sesionesRoutes = require("./sesionesRoute.js");
const authRoutes = require("./authRoute.js");

router.use("/reportes/", reportesRoutes());
router.use("/ventas/", ventasRoutes());
router.use("/proveedores/", proveedoresRoutes());
router.use("/productos/", productosRoutes());
router.use("/usuarios/", usuariosRoutes());
router.use("/clientes/", clientesRoutes());
router.use("/auditoria-productos/", auditoriaProductosRoutes());
router.use("/auditoria-clientes/", auditoriaClientesRoutes());
router.use("/auditoria-obras-sociales/", auditoriaObrasSocialesRoutes());
router.use("/obras-sociales/", obrasSocialesRoutes());
router.use("/sesiones/", sesionesRoutes());

router.use("/auth/", authRoutes);

module.exports = router;
