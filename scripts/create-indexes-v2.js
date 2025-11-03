// Script alternativo: Usa la conexión del proyecto (db.js)
// Esto evita problemas de autenticación ya que usa la misma configuración que funciona

const db = require("../db");
const fs = require("fs");
const path = require("path");

// Leer el archivo SQL
const sqlFile = path.join(__dirname, "..", "database_indexes.sql");
const sqlContent = fs.readFileSync(sqlFile, "utf8");

// Separar las queries (solo CREATE INDEX)
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

console.log(`📊 Encontradas ${queries.length} queries de índices a crear...\n`);

let created = 0;
let skipped = 0;
let errors = 0;

// Ejecutar cada query usando el pool del proyecto
function executeQueries(index = 0) {
  if (index >= queries.length) {
    // Mostrar resumen cuando terminemos
    console.log("\n" + "=".repeat(50));
    console.log("📊 RESUMEN DE EJECUCIÓN:");
    console.log("=".repeat(50));
    console.log(`✅ Índices creados: ${created}`);
    console.log(`⏭️  Índices omitidos (ya existían): ${skipped}`);
    console.log(`❌ Errores: ${errors}`);
    console.log(`📈 Total procesado: ${queries.length}`);
    console.log("=".repeat(50));
    
    // El pool se cierra automáticamente cuando termina el proceso
    // Pero podemos cerrarlo explícitamente
    if (db && typeof db.end === 'function') {
      db.end((err) => {
        if (err) {
          console.error("⚠️  Error al cerrar conexión:", err.message);
        } else {
          console.log("\n✅ Proceso completado. Conexión cerrada.");
        }
        process.exit(0);
      });
    } else {
      console.log("\n✅ Proceso completado.");
      process.exit(0);
    }
    return;
  }

  const query = queries[index];
  const indexNameMatch = query.match(/CREATE INDEX\s+(\w+)\s+ON/i);
  const indexName = indexNameMatch ? indexNameMatch[1] : `índice_${index + 1}`;

  // Ejecutar la query
  db.query(query + ";", (err, results) => {
    if (err) {
      // Si el índice ya existe, es un error esperado
      if (
        err.code === "ER_DUP_KEYNAME" ||
        err.message.includes("Duplicate key name") ||
        err.message.includes("already exists")
      ) {
        console.log(`⏭️  Índice ${indexName} ya existe, omitiendo...`);
        skipped++;
      } else {
        console.error(`❌ Error al crear ${indexName}:`, err.message);
        errors++;
      }
    } else {
      console.log(`✅ Índice ${indexName} creado exitosamente`);
      created++;
    }

    // Continuar con el siguiente índice
    executeQueries(index + 1);
  });
}

// Iniciar ejecución
console.log("🚀 Iniciando creación de índices...\n");
console.log("ℹ️  Usando la conexión configurada en db.js\n");

// Verificar que podemos conectarnos ejecutando una query simple
db.query("SELECT 1", (err) => {
  if (err) {
    console.error("❌ Error al conectar a la base de datos:", err.message);
    console.error("\n💡 Verifica:");
    console.error("   - Que tu archivo .env tenga las credenciales correctas");
    console.error("   - Que el servidor MySQL esté ejecutándose");
    console.error("   - Que puedas iniciar tu aplicación normalmente (npm start)");
    process.exit(1);
  }

  console.log("✅ Conexión verificada con la base de datos\n");
  executeQueries(0);
});

