# 🔍 Revisión de Optimizaciones Pendientes - FarmaGest Backend

## 📋 Resumen Ejecutivo

Estado actual: puntos 1-4 completados y sincronizados en main.

Esta revisión identifica los principales puntos de optimización pendientes en el código del backend. Se han identificado **8 áreas críticas** que requieren atención para mejorar el rendimiento, la confiabilidad y la escalabilidad de la aplicación.

---

## 🔴 CRÍTICO - Requiere Atención Inmediata

### 1. **Gestión de Conexiones a Base de Datos** ❌
**Archivo:** `db.js`  
**Problema:** Se está usando `mysql.createConnection()` en lugar de `mysql.createPool()`.

**Impacto:**
- Una sola conexión para todas las peticiones concurrentes
- Riesgo de saturación bajo carga
- Posibles timeouts y errores de conexión

**Solución:**
```javascript
// Actual (ineficiente)
this.connection = mysql.createConnection({...});

// Debería ser:
this.pool = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  timezone: "Z",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
```

---

### 2. **Problema con Query IN() en ventasModel.js** ❌
**Archivo:** `models/ventasModel.js` (línea 56)  
**Problema:** La query `WHERE iv.venta_id IN (?)` no funciona correctamente con arrays en MySQL.

**Código actual:**
```javascript
const ventaIds = ventas.map((venta) => venta.venta_id);
const queryItems = `WHERE iv.venta_id IN (?)`;
db.query(queryItems, [ventaIds], ...);
```

**Problema:** Esto pasa el array como un solo parámetro en lugar de múltiples valores.

**Solución:**
```javascript
// Opción 1: Usar placeholders múltiples
const placeholders = ventaIds.map(() => '?').join(',');
const queryItems = `
  SELECT ... FROM items_venta iv
  JOIN productos p ON iv.producto_id = p.producto_id
  WHERE iv.venta_id IN (${placeholders})
`;
db.query(queryItems, ventaIds, ...);

// Opción 2: Si hay muchos IDs, usar FIND_IN_SET (menos eficiente)
WHERE FIND_IN_SET(iv.venta_id, ?) > 0
// Y pasar: ventaIds.join(',')
```

---

### 3. **Falta de Transacciones en Operaciones Críticas** ❌
**Archivo:** `models/ventasModel.js` - método `agregarVenta()`  
**Problema:** Las operaciones de inserción de venta, items y actualización de stock no están dentro de una transacción.

**Impacto:**
- Si falla cualquier operación intermedia, la base de datos queda inconsistente
- El stock puede quedar incorrecto si falla después de insertar items
- No hay rollback automático en caso de error

**Código actual (líneas 126-185):**
```javascript
// Insertar venta → Insertar items (forEach) → Actualizar stock (forEach)
// Si falla en medio, queda inconsistente
```

**Solución:**
Usar transacciones de MySQL:
```javascript
static agregarVenta(nuevaVenta, itemsAgregados, callback) {
  db.beginTransaction((err) => {
    if (err) return callback(err);
    
    // Insertar venta
    db.query("INSERT INTO ventas ...", [...], (err, resultado) => {
      if (err) {
        db.rollback(() => callback(err));
        return;
      }
      
      const ventaId = resultado.insertId;
      
      // Insertar items en batch
      const values = itemsAgregados.map(item => [
        ventaId, item.productoId, item.cantidad, item.precio, item.total
      ]);
      
      db.query(
        "INSERT INTO items_venta (...) VALUES ?",
        [values],
        (err) => {
          if (err) {
            db.rollback(() => callback(err));
            return;
          }
          
          // Actualizar stock en batch
          // Usar CASE WHEN o múltiples UPDATEs
          // ...
          
          db.commit((err) => {
            if (err) {
              db.rollback(() => callback(err));
              return;
            }
            callback(null, ventaId);
          });
        }
      );
    });
  });
}
```

---

### 4. **Múltiples Queries Dentro de forEach** ❌
**Archivo:** `models/ventasModel.js` - método `agregarVenta()` (líneas 149-179)  
**Problema:** Se hacen queries individuales dentro de un `forEach`, lo que es muy ineficiente.

**Problemas:**
- N queries para N items (problema N+1)
- No se espera a que terminen todas antes de llamar el callback
- El callback se llama antes de que todas las operaciones terminen
- Posible race condition

**Solución:**
Usar batch inserts:
```javascript
// En lugar de forEach con INSERT individual
// Usar INSERT con múltiples valores
const values = itemsAgregados.map(item => [
  ventaId, item.productoId, item.cantidad, item.precio, item.total
]);

db.query(
  "INSERT INTO items_venta (venta_id, producto_id, cantidad, precio_unitario, total_item) VALUES ?",
  [values],
  callback
);

// Para actualizar stock, usar CASE WHEN o múltiples UPDATEs en batch
```

---

## 🟡 IMPORTANTE - Mejoras de Rendimiento

### 5. **Actualización de Sesiones Asíncrona sin Esperar** ⚠️
**Archivos:** Múltiples modelos (productosModel.js, usuariosModel.js, clientesModel.js, etc.)  
**Problema:** La actualización de `ultima_actividad` se hace de forma asíncrona sin esperar, y si hay error, se devuelve en el callback pero la query principal ya continuó.

**Impacto:**
- Race conditions potenciales
- Errores silenciosos
- Lógica de actualización mezclada con lógica de negocio

**Solución:**
- Mover la actualización de sesión a middleware
- O usar `Promise.all()` si se migra a Promises
- O asegurarse de que el error no afecte la respuesta principal

---

### 6. **Falta de Índices en Queries** ⚠️
**Archivos:** Todos los modelos con queries de búsqueda  
**Problema:** Las queries usan `LIKE` en múltiples campos y `ORDER BY`, pero no hay evidencia de índices.

**Queries afectadas:**
- `WHERE nombre LIKE ? OR codigo LIKE ? OR marca LIKE ?`
- `WHERE nombre LIKE ? OR apellido LIKE ? OR dni LIKE ?`
- `ORDER BY fecha_hora DESC`

**Recomendaciones:**
Crear índices en:
```sql
-- Índices para búsquedas
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_marca ON productos(marca);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_apellido ON clientes(apellido);
CREATE INDEX idx_clientes_dni ON clientes(dni);

-- Índices para ordenamiento
CREATE INDEX idx_ventas_fecha_hora ON ventas(fecha_hora DESC);
CREATE INDEX idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX idx_items_venta_venta_id ON items_venta(venta_id);
CREATE INDEX idx_productos_deleted_at ON productos(deleted_at);
```

---

### 7. **Queries de Búsqueda Pueden Usar FULLTEXT** 💡
**Archivos:** Modelos con búsquedas multi-campo  
**Problema:** Múltiples `LIKE` con `OR` son ineficientes en MySQL.

**Mejora sugerida:**
Para búsquedas de texto, considerar índices FULLTEXT:
```sql
ALTER TABLE productos ADD FULLTEXT INDEX ft_busqueda (nombre, codigo, marca);
```

Y usar:
```sql
WHERE MATCH(nombre, codigo, marca) AGAINST(? IN NATURAL LANGUAGE MODE)
```

---

## 🟢 MEJORAS MENORES

### 8. **Validación de Stock Antes de Insertar** 💡
**Archivo:** `models/ventasModel.js`  
**Problema:** No se valida el stock disponible antes de intentar vender.

**Solución:**
Agregar validación previa:
```javascript
// Antes de insertar la venta
const stockQuery = `
  SELECT producto_id, stock 
  FROM productos 
  WHERE producto_id IN (?) AND stock >= ?
`;

// Validar que todos los productos tengan stock suficiente
```

---

### 9. **Manejo de Errores Inconsistente** 💡
**Problema:** Algunos callbacks no manejan errores de forma consistente.

**Recomendación:**
- Usar un middleware de manejo de errores global
- Estandarizar formato de respuestas de error
- Considerar migrar a async/await con try/catch

---

### 10. **CORS Configurado para Permitir Cualquier Origen** ⚠️
**Archivo:** `index.js` (línea 11)  
**Problema:** `origin: "*"` permite cualquier origen, riesgo de seguridad.

**Solución:**
```javascript
cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  credentials: true
})
```

---

## 📊 Priorización de Tareas

### Fase 1 - Crítico (Hacer primero):
1. ✅ Cambiar a connection pool (`db.js`)
2. ✅ Arreglar query `IN()` en `ventasModel.js`
3. ✅ Implementar transacciones en `agregarVenta()`
4. ✅ Reemplazar forEach con batch inserts

### Fase 2 - Importante (Próximos):
5. ✅ Reorganizar actualización de sesiones
6. ✅ Agregar índices de base de datos
7. ✅ Validar stock antes de ventas

### Fase 3 - Mejoras (Futuro):
8. ✅ Considerar índices FULLTEXT para búsquedas
9. ✅ Mejorar manejo de errores
10. ✅ Restringir CORS

---

## 📝 Notas Adicionales

- **Migración a Promises/Async-Await:** Considerar migrar de callbacks a Promises/async-await para mejor legibilidad y manejo de errores.
- **Caché:** Para datos frecuentemente consultados (como categorías), considerar implementar caché (Redis).
- **Logging:** Implementar logging estructurado para mejor debugging y monitoreo.
- **Validación:** Agregar validación de entrada más robusta (Joi, Yup, etc.).

---

**Fecha de revisión:** $(date)  
**Revisado por:** Sistema de análisis automático

