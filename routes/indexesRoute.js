// Ruta temporal para crear índices en la base de datos
// IMPORTANTE: Eliminar o proteger esta ruta después de usar

const express = require("express");
const router = express.Router();
const db = require("../db");
const fs = require("fs");
const path = require("path");

router.post("/crear", (req, res) => {
  // Leer el archivo SQL
  const sqlFile = path.join(__dirname, "..", "database_indexes.sql");
  
  try {
    const sqlContent = fs.readFileSync(sqlFile, "utf8");

    // Separar las queries
    const queries = sqlContent
      .split(";")
      .map((query) => query.trim())
      .filter(
        (query) =>
          query.length > 0 &&
          !query.startsWith("--") &&
          !query.startsWith("/*") &&
          query.toUpperCase().startsWith("CREATE INDEX")
      );

    let created = 0;
    let skipped = 0;
    let errors = [];
    let completed = 0;

    // Función recursiva para ejecutar queries una por una
    function executeNextQuery(index) {
      if (index >= queries.length) {
        return res.json({
          success: true,
          message: "Proceso completado",
          summary: {
            total: queries.length,
            created: created,
            skipped: skipped,
            errors: errors.length,
            errorDetails: errors,
          },
        });
      }

      const query = queries[index];
      const indexNameMatch = query.match(/CREATE INDEX\s+(\w+)\s+ON/i);
      const indexName = indexNameMatch ? indexNameMatch[1] : `índice_${index + 1}`;

      db.query(query + ";", (err, results) => {
        if (err) {
          if (
            err.code === "ER_DUP_KEYNAME" ||
            err.message.includes("Duplicate key name") ||
            err.message.includes("already exists")
          ) {
            skipped++;
          } else {
            errors.push({
              index: indexName,
              error: err.message,
            });
          }
        } else {
          created++;
        }

        completed++;
        // Continuar con el siguiente
        executeNextQuery(index + 1);
      });
    }

    // Iniciar ejecución
    executeNextQuery(0);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Endpoint para verificar estado
router.get("/status", (req, res) => {
  res.json({
    message: "Endpoint de índices activo",
    instrucciones:
      "Envía POST a /api/indexes/crear para crear los índices",
  });
});

module.exports = router;

