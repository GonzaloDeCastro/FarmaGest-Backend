# 🚀 Guía Rápida: Ejecutar Índices en la Base de Datos

## ✅ Método más fácil: MySQL Workbench

### Paso 1: Abrir MySQL Workbench
- Abre MySQL Workbench en tu computadora
- Si no lo tienes, descárgalo desde: https://dev.mysql.com/downloads/workbench/

### Paso 2: Conectarte a tu Base de Datos
1. Clic en el ícono de conexión que tienes configurado
2. O crea una nueva conexión:
   - **Hostname**: El valor de `host` de tu archivo `.env` (generalmente `localhost`)
   - **Port**: 3306 (o el que configuraste)
   - **Username**: El valor de `user` de tu `.env`
   - **Password**: El valor de `password` de tu `.env`
   - Haz clic en "OK"

### Paso 3: Seleccionar la Base de Datos
- En el panel izquierdo, haz doble clic en tu base de datos
- O ejecuta: `USE nombre_de_tu_base_de_datos;`

### Paso 4: Ejecutar el Script
1. Clic en **File > Open SQL Script**
2. Navega a: `FarmaGest-Backend/database_indexes.sql`
3. Abre el archivo
4. Haz clic en el botón **⚡ (Execute)** o presiona `Ctrl+Shift+Enter`
5. ¡Listo! Verás los índices creados

### Verificar que Funcionó
Ejecuta en Workbench:
```sql
SHOW INDEX FROM productos;
```
Deberías ver los nuevos índices listados.

---

## 🔧 Método Alternativo: Línea de Comandos

Si tienes MySQL instalado y en el PATH:

### Windows (PowerShell):
```powershell
# Si MySQL está en Program Files
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u usuario -p nombre_base_datos < database_indexes.sql
```

### O conectarte primero:
```powershell
# Conectarte
& "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u usuario -p nombre_base_datos

# Luego dentro de MySQL:
source database_indexes.sql
```

---

## 🐛 Si Tienes Problemas de Autenticación

Si ves el error `auth_gssapi_client`, puedes cambiar el método de autenticación del usuario MySQL:

### En MySQL Workbench, ejecuta:
```sql
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

Luego intenta conectarte nuevamente.

---

## 📊 Verificar Índices Creados

Después de ejecutar el script, verifica los índices con:

```sql
-- Ver todos los índices de una tabla
SHOW INDEX FROM productos;
SHOW INDEX FROM clientes;
SHOW INDEX FROM usuarios;
SHOW INDEX FROM ventas;

-- O ver todos los índices de la base de datos
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
ORDER BY TABLE_NAME, INDEX_NAME;
```

---

## ✅ Qué Esperar

- Si el índice ya existe: Verás un error pero puedes ignorarlo
- Si el índice se crea: Verás mensajes de éxito
- **Total esperado**: ~19 índices creados

---

## 💡 Tips

- Ejecuta el script **una sola vez** después de configurar la base de datos
- Los índices mejoran el rendimiento, especialmente con muchos registros
- Si tienes datos grandes, puede tomar unos minutos crear los índices
- Los índices no afectan la funcionalidad, solo mejoran la velocidad

