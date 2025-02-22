// index.js

const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;
const routes = require("./routes/routes.js"); // Cambiado a plural para reflejar múltiples rutas

app.use(express.json());
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://farma-gest.vercel.app",
      "https://anotherdomain.com",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Rutas
app.use("/api", routes); // Monta las rutas definidas en routes.js en el endpoint '/'

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
