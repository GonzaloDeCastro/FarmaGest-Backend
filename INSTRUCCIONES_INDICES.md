# 📋 Instrucciones para Ejecutar el Script de Índices

## Opción 1: MySQL Workbench / Cliente Gráfico

1. Abre MySQL Workbench (o tu cliente MySQL preferido)
2. Conéctate a tu servidor MySQL
3. Selecciona la base de datos correspondiente
4. Abre el archivo `database_indexes.sql`
5. Ejecuta todo el script (ejecutar todo o presionar F9)

## Opción 2: Línea de Comandos MySQL

```bash
# Conectarte a MySQL (ajusta credenciales según tu configuración)
mysql -u tu_usuario -p tu_base_de_datos

# Una vez conectado, ejecutar:
source database_indexes.sql
```

O directamente:
```bash
mysql -u tu_usuario -p tu_base_de_datos < database_indexes.sql
```

## Opción 3: Script Node.js (si el problema de autenticación se resuelve)

El script `scripts/create-indexes.js` está listo para usar una vez que se resuelva el problema de autenticación con MySQL.

### Solución al Error de Autenticación

El error `auth_gssapi_client` generalmente ocurre cuando:
- El servidor MySQL está configurado con un plugin de autenticación no estándar
- Estás usando una conexión remota con autenticación diferente

**Solución temporal:** Usar la opción 1 o 2 (ejecución manual del SQL)

**Solución permanente:** Configurar el usuario MySQL para usar el plugin `mysql_native_password`:

```sql
ALTER USER 'tu_usuario'@'localhost' IDENTIFIED WITH mysql_native_password BY 'tu_contraseña';
FLUSH PRIVILEGES;
```

## Verificación

Después de ejecutar el script, verifica que los índices se crearon:

```sql
-- Ver índices de una tabla específica
SHOW INDEX FROM productos;
SHOW INDEX FROM clientes;
SHOW INDEX FROM usuarios;
SHOW INDEX FROM ventas;
SHOW INDEX FROM items_venta;
```

## Notas

- Si un índice ya existe, verás un error pero puedes ignorarlo
- Los índices mejorarán el rendimiento de las consultas, especialmente en tablas grandes
- El tiempo de creación depende del tamaño de las tablas

