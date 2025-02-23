// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 3000;
const routes = require("./routes/routes.js"); // Cambiado a plural para reflejar múltiples rutas
app.use(express.json());
app.use(
  cors({
    origin: "*", // 🔥 Cambia a tu dominio real si es necesario
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Route to display a message
app.get("/", (req, res) => {
  res.send("Server ok!!");
});

// Rutas
app.use("/api", routes); // Monta las rutas definidas en routes.js en el endpoint '/'

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
