-- =====================================================
-- Script para Solucionar Autenticación MySQL
-- =====================================================
-- Este script cambia el método de autenticación del usuario
-- de auth_gssapi_client a mysql_native_password
-- 
-- IMPORTANTE: Reemplaza 'TU_USUARIO' y 'TU_CONTRASENA' con tus valores reales
-- Puedes encontrar estos valores en tu archivo .env
-- =====================================================

-- Paso 1: Verificar el método de autenticación actual
-- (Ejecuta esto primero para ver qué usuario tienes)
SELECT user, host, plugin 
FROM mysql.user 
WHERE user LIKE '%tu_usuario%';  -- Reemplaza 'tu_usuario' con parte de tu usuario

-- =====================================================
-- Paso 2: Cambiar autenticación del usuario
-- =====================================================
-- Reemplaza los siguientes valores:
--   - TU_USUARIO: El valor de 'user' en tu archivo .env
--   - TU_CONTRASENA: El valor de 'password' en tu archivo .env
--   - localhost o %: Depende de cómo esté configurado tu usuario

-- Si tu usuario es @localhost:
ALTER USER 'TU_USUARIO'@'localhost' IDENTIFIED WITH mysql_native_password BY 'TU_CONTRASENA';

-- Si tu usuario es remoto (@'%'):
-- ALTER USER 'TU_USUARIO'@'%' IDENTIFIED WITH mysql_native_password BY 'TU_CONTRASENA';

-- Aplicar los cambios
FLUSH PRIVILEGES;

-- =====================================================
-- Paso 3: Verificar que el cambio funcionó
-- =====================================================
SELECT user, host, plugin 
FROM mysql.user 
WHERE user = 'TU_USUARIO';

-- Deberías ver 'mysql_native_password' en la columna 'plugin'

-- =====================================================
-- INSTRUCCIONES:
-- =====================================================
-- 1. Abre MySQL Workbench
-- 2. Conéctate a tu servidor MySQL (como root o usuario con privilegios)
-- 3. Reemplaza TU_USUARIO y TU_CONTRASENA con tus valores reales
-- 4. Ejecuta el ALTER USER y FLUSH PRIVILEGES
-- 5. Verifica con el SELECT final
-- 6. Reinicia tu aplicación Node.js
-- 7. Ejecuta: node scripts/ejecutar-indices-auto.js
-- =====================================================

