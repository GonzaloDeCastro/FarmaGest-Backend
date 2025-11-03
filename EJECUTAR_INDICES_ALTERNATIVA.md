# 🚀 Alternativa: Ejecutar Índices mediante API

Esta es una alternativa que usa tu propia aplicación para ejecutar los índices, evitando problemas de autenticación.

## ✅ Pasos para Ejecutar

### Paso 1: Iniciar tu servidor

Abre una terminal y ejecuta:
```bash
npm start
```

O si usas nodemon:
```bash
npm run start
```

Deja esta terminal corriendo.

### Paso 2: En otra terminal, ejecutar el script

Abre **otra terminal** (mientras el servidor sigue corriendo) y ejecuta:

```bash
node scripts/ejecutar-indices-http.js
```

### Paso 3: Ver los resultados

El script mostrará:
- ✅ Índices creados exitosamente
- ⏭️  Índices que ya existían (omitidos)
- ❌ Errores si hubo alguno

## 📊 Ejemplo de Salida Esperada

```
🚀 Ejecutando creación de índices mediante API...
📡 Enviando petición a: http://localhost:3001/api/indexes/crear
📊 RESULTADO:
==================================================
{
  "success": true,
  "message": "Proceso completado",
  "summary": {
    "total": 19,
    "created": 19,
    "skipped": 0,
    "errors": 0
  }
}
==================================================
✅ ¡Índices creados exitosamente!
   - Creados: 19
   - Omitidos (ya existían): 0
   - Errores: 0
```

## 🔍 Verificar que Funcionó

Después de ejecutar, puedes verificar los índices en tu base de datos o usando la aplicación.

## ⚠️ Importante

1. **El servidor debe estar corriendo** para que esto funcione
2. Esta ruta (`/api/indexes/crear`) es temporal
3. Después de crear los índices, puedes eliminar la ruta temporal si quieres mayor seguridad

## 🗑️ Limpiar Después de Usar (Opcional)

Si quieres eliminar la ruta temporal después de crear los índices:

1. Abre `routes/routes.js`
2. Elimina o comenta estas líneas:
   ```javascript
   const indexesRoute = require("./indexesRoute.js");
   // ... más abajo ...
   router.use("/indexes/", indexesRoute);
   ```

---

## ❓ ¿Por qué funciona esta alternativa?

- Usa la misma conexión que tu aplicación (que ya funciona)
- No necesita configuración adicional de autenticación
- Ejecuta las queries de forma segura a través del servidor Express

---

## 🆘 Si Tienes Problemas

### Error: "Cannot connect"
- Verifica que el servidor esté corriendo
- Verifica el puerto (default: 3001)
- Revisa que no haya errores en la terminal del servidor

### Error: "Route not found"
- Verifica que `routes/indexesRoute.js` exista
- Verifica que se haya agregado la ruta en `routes/routes.js`
- Reinicia el servidor

### El servidor no inicia
- Verifica tu archivo `.env` tiene las credenciales correctas
- Verifica que MySQL esté ejecutándose
- Revisa los errores en la consola

