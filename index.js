// index.js

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const routes = require("./routes/routes.js"); // Cambiado a plural para reflejar múltiples rutas

app.use(express.json());
app.use(cors());

// Rutas
app.use("/api", routes); // Monta las rutas definidas en routes.js en el endpoint '/'

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
