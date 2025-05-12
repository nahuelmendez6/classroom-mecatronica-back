-- Insertar roles básicos del sistema
INSERT INTO `role` (`name`, `description`) VALUES
('Administrador', 'Rol con acceso total al sistema'),
('Profesor', 'Rol para profesores y tutores'),
('Estudiante', 'Rol para estudiantes'),
('Tutor Empresa', 'Rol para tutores de empresas');

-- Nota: Los IDs se generarán automáticamente, pero típicamente serán:
-- 1: Administrador
-- 2: Profesor
-- 3: Estudiante
-- 4: Tutor Empresa 