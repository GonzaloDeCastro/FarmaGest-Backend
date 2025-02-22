// index.js

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const routes = require("./routes/routes.js"); // Cambiado a plural para reflejar múltiples rutas

app.use(express.json());
const corsOptions = {
  origin: "https://farma-gest-backend.vercel.app", // Asegúrate de cambiar esto al dominio correcto de tu frontend
};

app.use(cors(corsOptions));

// Rutas
app.use("/api", routes); // Monta las rutas definidas en routes.js en el endpoint '/'

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
