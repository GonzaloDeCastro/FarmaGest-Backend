# 🔧 Solución al Problema de Autenticación MySQL

## ❌ Problema Actual

El servidor MySQL está usando el plugin de autenticación `auth_gssapi_client` que no es compatible con `mysql2`. 

Error: `Server requests authentication using unknown plugin auth_gssapi_client`

## ✅ Solución

Necesitas cambiar el método de autenticación del usuario MySQL a `mysql_native_password`.

### Opción 1: En MySQL Workbench (Recomendado)

1. Conéctate a MySQL Workbench
2. Abre una nueva query
3. Ejecuta estos comandos (reemplaza con tus credenciales):

```sql
-- Cambiar el método de autenticación del usuario
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';

-- Si el usuario es remoto:
ALTER USER 'tu_usuario'@'%' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';

-- Aplicar cambios
FLUSH PRIVILEGES;
```

**Reemplaza:**
- `tu_usuario` → El valor de `user` en tu archivo `.env`
- `tu_contraseña` → El valor de `password` en tu archivo `.env`
- `localhost` o `%` → Según cómo esté configurado tu usuario

### Opción 2: Desde Línea de Comandos

Si tienes acceso a MySQL desde la terminal:

```bash
mysql -u root -p

# Luego ejecutar:
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

### Opción 3: Crear Nuevo Usuario con Autenticación Nativa

Si no puedes modificar el usuario existente, crea uno nuevo:

```sql
-- Crear nuevo usuario
CREATE USER 'nuevo_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'nueva_contraseña';

-- Dar permisos
GRANT ALL PRIVILEGES ON nombre_base_datos.* TO 'nuevo_usuario'@'localhost';
FLUSH PRIVILEGES;
```

Luego actualiza tu archivo `.env` con el nuevo usuario y contraseña.

## ✅ Verificar que Funcionó

Después de cambiar la autenticación:

1. Reinicia tu aplicación (`npm start`)
2. Verifica que la conexión funciona
3. Ejecuta nuevamente: `node scripts/ejecutar-indices-auto.js`

## 📝 Notas

- Este cambio solo afecta el método de autenticación, **NO** los datos
- Es seguro y no afecta la seguridad del servidor
- `mysql_native_password` es el método estándar usado por la mayoría de aplicaciones

## 🔍 Verificar el Método de Autenticación Actual

Para ver qué método está usando tu usuario:

```sql
SELECT user, host, plugin 
FROM mysql.user 
WHERE user = 'tu_usuario';
```

Si ves `auth_gssapi_client` o similar, necesitas cambiarlo.

