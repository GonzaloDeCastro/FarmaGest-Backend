// Script automático: Inicia el servidor, espera a que esté listo, 
// ejecuta los índices y luego cierra el servidor

const { spawn } = require("child_process");
const http = require("http");
const path = require("path");

require("dotenv").config();
const port = process.env.port || 3001;

let serverProcess = null;

console.log("🚀 Iniciando servidor automáticamente...\n");

// Función para verificar si el servidor está listo
function waitForServer(maxAttempts = 30, interval = 1000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const checkServer = () => {
      attempts++;

      const req = http.get(`http://localhost:${port}/`, (res) => {
        // Servidor está listo
        console.log("✅ Servidor está listo y respondiendo\n");
        resolve();
      });

      req.on("error", () => {
        if (attempts >= maxAttempts) {
          reject(new Error("Timeout: El servidor no respondió después de varios intentos"));
        } else {
          // Intentar de nuevo en un segundo
          setTimeout(checkServer, interval);
          if (attempts === 1 || attempts % 5 === 0) {
            process.stdout.write(`⏳ Esperando servidor... (${attempts}/${maxAttempts})\r`);
          }
        }
      });
    };

    checkServer();
  });
}

// Función para ejecutar los índices
function executeIndexes() {
  return new Promise((resolve, reject) => {
    console.log("📊 Ejecutando creación de índices...\n");

    const req = http.request(
      {
        hostname: "localhost",
        port: port,
        path: "/api/indexes/crear",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 300000, // 5 minutos timeout para crear todos los índices
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            console.log("\n📊 RESULTADO:");
            console.log("=".repeat(50));
            console.log(JSON.stringify(result, null, 2));
            console.log("=".repeat(50));

            if (result.success) {
              console.log("\n✅ ¡Índices creados exitosamente!");
              console.log(`   - Creados: ${result.summary.created}`);
              console.log(`   - Omitidos (ya existían): ${result.summary.skipped}`);
              console.log(`   - Errores: ${result.summary.errors}`);
              resolve(result);
            } else {
              console.log("\n❌ Hubo errores al crear los índices");
              if (result.errorDetails && result.errorDetails.length > 0) {
                console.log("\nDetalles de errores:");
                result.errorDetails.forEach((err) => {
                  console.log(`   - ${err.index}: ${err.error}`);
                });
              }
              reject(new Error("Error al crear índices"));
            }
          } catch (err) {
            console.error("❌ Error al parsear respuesta:", err.message);
            console.error("Respuesta recibida:", data);
            reject(err);
          }
        });
      }
    );

    req.on("error", (error) => {
      console.error("❌ Error de conexión:", error.message);
      reject(error);
    });

    req.on("timeout", () => {
      console.error("❌ Timeout: La creación de índices está tomando demasiado tiempo");
      req.destroy();
      reject(new Error("Timeout"));
    });

    req.end();
  });
}

// Función para cerrar el servidor
function closeServer() {
  return new Promise((resolve) => {
    if (serverProcess) {
      console.log("\n🛑 Cerrando servidor...");
      serverProcess.kill();
      
      // Esperar un momento para que se cierre
      setTimeout(() => {
        console.log("✅ Servidor cerrado\n");
        resolve();
      }, 1000);
    } else {
      resolve();
    }
  });
}

// Función principal
async function main() {
  try {
    // 1. Iniciar servidor
    console.log("📦 Iniciando servidor Node.js...");
    serverProcess = spawn("node", ["index.js"], {
      cwd: path.join(__dirname, ".."),
      stdio: "pipe",
      shell: true,
    });

    // Capturar output del servidor
    serverProcess.stdout.on("data", (data) => {
      const output = data.toString();
      if (output.includes("Servidor escuchando")) {
        console.log("✅ Servidor iniciado correctamente");
      }
    });

    serverProcess.stderr.on("data", (data) => {
      const error = data.toString();
      // Solo mostrar errores críticos, no warnings comunes
      if (
        !error.includes("deprecated") &&
        !error.includes("warning") &&
        !error.includes("ExperimentalWarning")
      ) {
        console.error("⚠️  Error del servidor:", error);
      }
    });

    serverProcess.on("error", (err) => {
      console.error("❌ Error al iniciar servidor:", err.message);
      process.exit(1);
    });

    // 2. Esperar a que el servidor esté listo
    await waitForServer();

    // 3. Ejecutar creación de índices
    await executeIndexes();

    // 4. Cerrar servidor
    await closeServer();

    console.log("\n🎉 ¡Proceso completado exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error durante la ejecución:", error.message);
    await closeServer();
    process.exit(1);
  }
}

// Manejar cierre del proceso
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Proceso interrumpido por el usuario");
  await closeServer();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await closeServer();
  process.exit(0);
});

// Ejecutar
main();

