# 🔧 Guía Rápida: Solucionar Autenticación MySQL

## 📋 Pasos Rápidos

### 1. Abre MySQL Workbench

### 2. Conéctate como administrador (root o usuario con privilegios)

### 3. Ejecuta este comando (REEMPLAZA los valores):

```sql
-- Reemplaza estos valores:
-- TU_USUARIO → valor de 'user' en tu archivo .env
-- TU_CONTRASENA → valor de 'password' en tu archivo .env

ALTER USER 'TU_USUARIO'@'localhost' IDENTIFIED WITH mysql_native_password BY 'TU_CONTRASENA';
FLUSH PRIVILEGES;
```

### 4. Ejemplo Real:

Si en tu `.env` tienes:
```
user=admin
password=miPassword123
```

Ejecutarías:
```sql
ALTER USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'miPassword123';
FLUSH PRIVILEGES;
```

### 5. Verificar que Funcionó:

```sql
SELECT user, host, plugin 
FROM mysql.user 
WHERE user = 'TU_USUARIO';
```

Debe mostrar `mysql_native_password` en la columna `plugin`.

### 6. Probar:

1. Reinicia tu aplicación (`npm start`)
2. Ejecuta: `node scripts/ejecutar-indices-auto.js`
3. Debería crear los índices sin errores

## ❓ ¿No sabes tu usuario?

Ejecuta esto para ver todos los usuarios:
```sql
SELECT user, host FROM mysql.user;
```

## 🆘 ¿Tienes problemas de permisos?

Si no tienes privilegios para modificar usuarios, contacta a tu administrador de base de datos o usa una cuenta con privilegios de administrador.

## 📝 Notas

- Este cambio NO afecta tus datos
- Solo cambia el método de autenticación
- Es seguro y estándar en MySQL

