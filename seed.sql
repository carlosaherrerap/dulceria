-- Semillas de datos para Pastelería Renzos
-- Inicializa el sistema con un administrador y datos de prueba

-- 1. Administrador (usuario: admin, contraseña: admin2026)
INSERT INTO administradores (nombre, email, password_hash)
VALUES ('Administrador Renzos', 'admin@renzos.com', '$2a$10$CzI9uVBRkLHpfhUeYuDuQQzjEZKIm.xs55Ovq4uWIu');

-- 2. Empleado de prueba
INSERT INTO empleados (nombre, email, password_hash)
VALUES ('Empleado Juan', 'juan@renzos.com', '$2y$10$7R9f5i5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5');

-- 3. Categorías
INSERT INTO categorias (id, nombre, descripcion) VALUES
('tortas', 'Tortas y Pasteles', 'Tortas personalizadas y clásicas'),
('bocaditos', 'Bocaditos Dulces y Salados', 'Alfajores, brownies, empanaditas'),
('bebidas', 'Bebidas Afines', 'Café, jugos y gaseosas');

-- 4. Productos
INSERT INTO productos (id, nombre, descripcion, categoria_id, activo) VALUES
('torta-choco', 'Torta de Chocolate Premium', 'Nuestra especialidad con fudge artesanal', 'tortas', true),
('alfajor-manjar', 'Alfajores de Manjar Blanco', 'Suaves y rellenos de puro manjar', 'bocaditos', true);

-- 5. Presentaciones
INSERT INTO presentaciones (id, producto_id, tipo, cantidad, unidad, precio, stock, activo) VALUES
('torta-choco-grande', 'torta-choco', 'Grande', 1, 'unidad', 85.00, 10, true),
('torta-choco-porcion', 'torta-choco', 'Porción', 1, 'unidad', 12.00, 20, true),
('alfajor-caja-12', 'alfajor-manjar', 'Caja x12', 12, 'unidades', 25.00, 50, true);

-- 6. FAQ Iniciales para el Bot
INSERT INTO preguntas_frecuentes (categoria, pregunta, palabras_clave, respuesta, activo) VALUES
('horario', '¿Cuál es su horario de atención?', 'horario,atencion,abierto', 'Atendemos de Lunes a Sábado de 9 AM a 8 PM. ¡Te esperamos!', true),
('ubicacion', '¿Dónde están ubicados?', 'donde,ubicacion,direccion', 'Estamos en la Av. Principal 123, frente al parque central.', true),
('reclamos', 'Quiero hacer un reclamo', 'reclamo,queja,malo', 'Lamentamos los inconvenientes. Por favor, detállanos lo sucedido y un asesor humano te contactará a la brevedad.', true);

-- 7. Sugerencias Mixtas (IA Context)
INSERT INTO sugerencias_mixtas (ocasion, palabras_clave, descripcion, presentaciones_ids, precio_estimado, activo) VALUES
('cumpleaños', 'cumpleaños,cumple,fiesta', 'Combo Cumpleañero: Torta Chocolate Grande + 12 Alfajores', '["torta-choco-grande", "alfajor-caja-12"]', 110.00, true);
