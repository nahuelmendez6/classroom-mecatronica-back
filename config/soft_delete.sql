-- Añadir columna is_deleted a la tabla user
ALTER TABLE `user` 
ADD COLUMN `is_deleted` BOOLEAN DEFAULT FALSE,
ADD COLUMN `deleted_at` DATETIME DEFAULT NULL;

-- Añadir columna is_deleted a la tabla admin
ALTER TABLE `admin` 
ADD COLUMN `is_deleted` BOOLEAN DEFAULT FALSE,
ADD COLUMN `deleted_at` DATETIME DEFAULT NULL;

-- Crear índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_user_is_deleted ON `user` (`is_deleted`);
CREATE INDEX idx_admin_is_deleted ON `admin` (`is_deleted`); 