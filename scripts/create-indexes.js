// Script para ejecutar el archivo SQL de índices
// Usa la misma configuración de conexión que el proyecto

require("dotenv").config();
const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

// Configuración de conexión desde .env - usar pool como db.js
const pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  timezone: "Z",
  waitForConnections: true,
  connectionLimit: 1, // Una sola conexión para este script
  queueLimit: 0,
});

// Leer el archivo SQL
const sqlFile = path.join(__dirname, "..", "database_indexes.sql");
const sqlContent = fs.readFileSync(sqlFile, "utf8");

// Separar las queries (eliminar comentarios y líneas vacías)
const queries = sqlContent
  .split(";")
  .map((query) => query.trim())
  .filter(
    (query) =>
      query.length > 0 &&
      !query.startsWith("--") &&
      !query.startsWith("/*") &&
      query.startsWith("CREATE INDEX")
  );

console.log(`📊 Encontradas ${queries.length} queries de índices a crear...\n`);

let created = 0;
let skipped = 0;
let errors = 0;

// Ejecutar cada query usando pool
async function executeQueries() {
  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    const indexNameMatch = query.match(/CREATE INDEX\s+(\w+)\s+ON/);
    const indexName = indexNameMatch ? indexNameMatch[1] : `índice_${i + 1}`;

    try {
      await new Promise((resolve, reject) => {
        pool.query(query + ";", (err, results) => {
          if (err) {
            // Si el índice ya existe, es un error esperado
            if (err.code === "ER_DUP_KEYNAME" || err.message.includes("Duplicate key name")) {
              console.log(`⏭️  Índice ${indexName} ya existe, omitiendo...`);
              skipped++;
              resolve();
            } else {
              console.error(`❌ Error al crear ${indexName}:`, err.message);
              errors++;
              // Continuar aunque haya error (no rechazar)
              resolve();
            }
          } else {
            console.log(`✅ Índice ${indexName} creado exitosamente`);
            created++;
            resolve();
          }
        });
      });
    } catch (err) {
      // Continuar con el siguiente índice aunque haya error
      console.error(`⚠️  Error inesperado con ${indexName}:`, err.message);
      errors++;
      continue;
    }
  }

  // Mostrar resumen
  console.log("\n" + "=".repeat(50));
  console.log("📊 RESUMEN DE EJECUCIÓN:");
  console.log("=".repeat(50));
  console.log(`✅ Índices creados: ${created}`);
  console.log(`⏭️  Índices omitidos (ya existían): ${skipped}`);
  console.log(`❌ Errores: ${errors}`);
  console.log(`📈 Total procesado: ${queries.length}`);
  console.log("=".repeat(50));

  pool.end();
}

// Verificar conexión y ejecutar
pool.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err);
    console.error("\n💡 SOLUCIÓN:");
    console.error("   1. Verifica que tu archivo .env tenga las credenciales correctas");
    console.error("   2. Verifica que el servidor MySQL esté ejecutándose");
    console.error("   3. Usa MySQL Workbench como alternativa (ver EJECUTAR_INDICES_GUIA.md)");
    process.exit(1);
  }

  console.log("✅ Conectado a la base de datos MySQL\n");
  console.log(`📁 Base de datos: ${process.env.database || 'NO CONFIGURADA'}`);
  console.log(`🔗 Host: ${process.env.host || 'NO CONFIGURADO'}\n`);
  connection.release(); // Liberar la conexión de prueba
  
  console.log("🚀 Iniciando creación de índices...\n");

  executeQueries().catch((err) => {
    console.error("❌ Error crítico:", err);
    pool.end();
    process.exit(1);
  });
});

