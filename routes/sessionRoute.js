const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/sesionesController.js");

module.exports = () => {
  router.get("/all", sessionController.getUserSession);
  router.get("/get-login", sessionController.getLogin);

  router.put("/:id", sessionController.logoutSession);

  router.post("/", sessionController.addSession);

  return router;
};
