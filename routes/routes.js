const express = require("express");
const router = express.Router();

const productosRoutes = require("./productosRoute.js");

router.use("/productos/", productosRoutes());

module.exports = router;
