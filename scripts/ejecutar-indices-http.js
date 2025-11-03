// Script alternativo: Usa una petición HTTP al servidor local
// Esto funciona porque el servidor Express ya maneja la conexión correctamente

const http = require("http");

require("dotenv").config();
const port = process.env.port || 3001;

// Leer el puerto desde .env o usar el default
const url = `http://localhost:${port}/api/indexes/crear`;

console.log("🚀 Ejecutando creación de índices mediante API...\n");
console.log(`📡 Enviando petición a: ${url}\n`);
console.log("⚠️  Asegúrate de que tu servidor esté ejecutándose (npm start)\n");

// Opción 1: Usar fetch si está disponible (Node 18+)
if (typeof fetch !== 'undefined') {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("📊 RESULTADO:");
      console.log("=".repeat(50));
      console.log(JSON.stringify(data, null, 2));
      console.log("=".repeat(50));
      
      if (data.success) {
        console.log("\n✅ ¡Índices creados exitosamente!");
        console.log(`   - Creados: ${data.summary.created}`);
        console.log(`   - Omitidos (ya existían): ${data.summary.skipped}`);
        console.log(`   - Errores: ${data.summary.errors}`);
      } else {
        console.log("\n❌ Hubo errores al crear los índices");
      }
    })
    .catch((error) => {
      console.error("❌ Error:", error.message);
      console.error("\n💡 Asegúrate de que:");
      console.error("   1. El servidor esté ejecutándose (npm start)");
      console.error("   2. El puerto sea correcto (default: 3001)");
      console.error("   3. La ruta /api/indexes/crear esté disponible");
      process.exit(1);
    });
} else {
  // Opción 2: Usar http nativo para versiones anteriores
  const req = http.request(
    {
      hostname: "localhost",
      port: port,
      path: "/api/indexes/crear",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
    (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          console.log("📊 RESULTADO:");
          console.log("=".repeat(50));
          console.log(JSON.stringify(result, null, 2));
          console.log("=".repeat(50));

          if (result.success) {
            console.log("\n✅ ¡Índices creados exitosamente!");
            console.log(`   - Creados: ${result.summary.created}`);
            console.log(`   - Omitidos (ya existían): ${result.summary.skipped}`);
            console.log(`   - Errores: ${result.summary.errors}`);
          } else {
            console.log("\n❌ Hubo errores al crear los índices");
          }
        } catch (err) {
          console.error("❌ Error al parsear respuesta:", err.message);
          console.error("Respuesta recibida:", data);
        }
      });
    }
  );

  req.on("error", (error) => {
    console.error("❌ Error:", error.message);
    console.error("\n💡 Asegúrate de que:");
    console.error("   1. El servidor esté ejecutándose (npm start)");
    console.error("   2. El puerto sea correcto (default: 3001)");
    console.error("   3. La ruta /api/indexes/crear esté disponible");
    process.exit(1);
  });

  req.end();
}

