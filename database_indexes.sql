-- =====================================================
-- Script de Optimización: Índices para FarmaGest-Backend
-- =====================================================
-- Este script crea índices optimizados basados en las 
-- queries más frecuentes del sistema.
-- Ejecutar en orden para mejorar el rendimiento de las consultas.
-- 
-- IMPORTANTE: Si un índice ya existe, MySQL mostrará un error.
-- Puedes ignorar esos errores o usar el script con verificaciones
-- incluido más abajo.
-- =====================================================

-- =====================================================
-- ÍNDICES PARA TABLA: productos
-- =====================================================
-- Optimiza búsquedas por nombre, código y marca
CREATE INDEX idx_productos_nombre ON productos(nombre);
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_marca ON productos(marca);

-- Optimiza filtro por deleted_at (soft delete)
CREATE INDEX idx_productos_deleted_at ON productos(deleted_at);

-- Optimiza JOIN con categorias
CREATE INDEX idx_productos_categoria_id ON productos(categoria_id);

-- Índice compuesto para queries de búsqueda con filtro deleted_at
CREATE INDEX idx_productos_busqueda ON productos(deleted_at, nombre, codigo, marca);

-- =====================================================
-- ÍNDICES PARA TABLA: clientes
-- =====================================================
-- Optimiza búsquedas por nombre, apellido y DNI
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_apellido ON clientes(apellido);
CREATE INDEX idx_clientes_dni ON clientes(dni);

-- Optimiza filtro por deleted_at (soft delete)
CREATE INDEX idx_clientes_deleted_at ON clientes(deleted_at);

-- Optimiza JOINs
CREATE INDEX idx_clientes_obra_social_id ON clientes(obra_social_id);
CREATE INDEX idx_clientes_ciudad_id ON clientes(ciudad_id);

-- Índice compuesto para queries de búsqueda con filtro deleted_at
CREATE INDEX idx_clientes_busqueda ON clientes(deleted_at, nombre, apellido, dni);

-- =====================================================
-- ÍNDICES PARA TABLA: usuarios
-- =====================================================
-- Optimiza búsquedas por nombre, apellido y correo
CREATE INDEX idx_usuarios_nombre ON usuarios(nombre);
CREATE INDEX idx_usuarios_apellido ON usuarios(apellido);
CREATE INDEX idx_usuarios_correo ON usuarios(correo);

-- Optimiza filtro por deleted_at (soft delete)
CREATE INDEX idx_usuarios_deleted_at ON usuarios(deleted_at);

-- Optimiza JOIN con roles y búsqueda por rol
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);

-- Índice compuesto para queries de búsqueda con filtro deleted_at
CREATE INDEX idx_usuarios_busqueda ON usuarios(deleted_at, nombre, apellido, correo);

-- =====================================================
-- ÍNDICES PARA TABLA: ventas
-- =====================================================
-- Optimiza ordenamiento por fecha_hora DESC (muy frecuente)
CREATE INDEX idx_ventas_fecha_hora ON ventas(fecha_hora DESC);

-- Optimiza JOINs
CREATE INDEX idx_ventas_cliente_id ON ventas(cliente_id);
CREATE INDEX idx_ventas_usuario_id ON ventas(usuario_id);

-- Índice compuesto para queries frecuentes de listado
CREATE INDEX idx_ventas_listado ON ventas(fecha_hora DESC, cliente_id, usuario_id);

-- =====================================================
-- ÍNDICES PARA TABLA: items_venta
-- =====================================================
-- Optimiza JOIN con ventas (muy frecuente)
CREATE INDEX idx_items_venta_venta_id ON items_venta(venta_id);

-- Optimiza JOIN con productos
CREATE INDEX idx_items_venta_producto_id ON items_venta(producto_id);

-- =====================================================
-- ÍNDICES PARA TABLA: obras_sociales
-- =====================================================
-- Optimiza búsquedas por obra_social, plan y codigo
CREATE INDEX idx_obras_sociales_obra_social ON obras_sociales(obra_social);
CREATE INDEX idx_obras_sociales_plan ON obras_sociales(plan);
CREATE INDEX idx_obras_sociales_codigo ON obras_sociales(codigo);

-- Optimiza filtro por deleted_at (soft delete)
CREATE INDEX idx_obras_sociales_deleted_at ON obras_sociales(deleted_at);

-- =====================================================
-- ÍNDICES PARA TABLA: proveedores
-- =====================================================
-- Optimiza búsquedas (si se usa LIKE en razón_social)
CREATE INDEX idx_proveedores_razon_social ON proveedores(razon_social);

-- =====================================================
-- ÍNDICES PARA TABLAS DE AUDITORÍA
-- =====================================================
-- Optimiza ordenamiento por fecha_movimiento DESC (muy frecuente)
CREATE INDEX idx_auditoria_productos_fecha ON auditoria_productos(fecha_movimiento DESC);
CREATE INDEX idx_auditoria_clientes_fecha ON auditoria_clientes(fecha_movimiento DESC);
CREATE INDEX idx_auditoria_obras_sociales_fecha ON auditoria_obras_sociales(fecha_movimiento DESC);

-- Optimiza JOINs con productos, clientes y usuarios
CREATE INDEX idx_auditoria_productos_producto_id ON auditoria_productos(producto_id);
CREATE INDEX idx_auditoria_productos_usuario_id ON auditoria_productos(usuario_id);

CREATE INDEX idx_auditoria_clientes_cliente_id ON auditoria_clientes(cliente_id);
CREATE INDEX idx_auditoria_clientes_usuario_id ON auditoria_clientes(usuario_id);

CREATE INDEX idx_auditoria_obras_sociales_obra_social_id ON auditoria_obras_sociales(obra_social_id);
CREATE INDEX idx_auditoria_obras_sociales_usuario_id ON auditoria_obras_sociales(usuario_id);

-- =====================================================
-- ÍNDICES PARA TABLA: sesiones
-- =====================================================
-- Optimiza búsqueda por sesion_id (si no es PK ya tiene índice)
-- Optimiza actualización de ultima_actividad (muy frecuente)
CREATE INDEX idx_sesiones_sesion_id ON sesiones(sesion_id);
CREATE INDEX idx_sesiones_correo_usuario ON sesiones(correo_usuario);
CREATE INDEX idx_sesiones_ultima_actividad ON sesiones(ultima_actividad);

-- =====================================================
-- VERIFICACIÓN DE ÍNDICES CREADOS
-- =====================================================
-- Ejecutar después de crear los índices para verificar:
-- SHOW INDEX FROM productos;
-- SHOW INDEX FROM clientes;
-- SHOW INDEX FROM usuarios;
-- SHOW INDEX FROM ventas;
-- SHOW INDEX FROM items_venta;
-- SHOW INDEX FROM obras_sociales;
-- SHOW INDEX FROM sesiones;

-- =====================================================
-- SCRIPT ALTERNATIVO: Verificar antes de crear
-- =====================================================
-- Si prefieres verificar si los índices existen antes de crearlos,
-- puedes usar consultas como estas (ejecutar manualmente o 
-- adaptar a un script en tu lenguaje preferido):
--
-- SELECT COUNT(*) as existe
-- FROM INFORMATION_SCHEMA.STATISTICS
-- WHERE TABLE_SCHEMA = DATABASE()
-- AND TABLE_NAME = 'productos'
-- AND INDEX_NAME = 'idx_productos_nombre';
--
-- Si retorna 0, el índice no existe y puedes crearlo.
-- =====================================================

-- =====================================================
-- NOTAS IMPORTANTES
-- =====================================================
-- 1. Los índices mejoran las lecturas pero pueden ralentizar 
--    ligeramente las escrituras (INSERT, UPDATE, DELETE).
-- 2. En tablas con pocos registros (< 1000), los índices pueden 
--    no ser necesarios, pero no causan problemas.
-- 3. Los índices compuestos son útiles para queries que filtran 
--    y ordenan por múltiples columnas.
-- 4. Si una columna ya es PRIMARY KEY o tiene UNIQUE constraint,
--    ya tiene un índice automático, no es necesario crear otro.
-- 5. Revisar periódicamente el uso de índices con:
--    EXPLAIN SELECT ... para ver qué índices se están usando.
-- =====================================================

