import express from 'express';
import OrganizationContactController from './organization.contact.controller.js';
import { verifyToken, checkRole } from '../middleware/auth.middleware.js';
import { organizationContactValidation } from '../utils/validation.js';
import { check } from 'express-validator';


// Crear una instancia del router
const router = express.Router();

// Middleware para verificar el token y el rol de usuario
router.use(verifyToken, checkRole(['administrador']));

// Rutas para manejar contactos de organización
router.get('/', OrganizationContactController.getAll);
router.get('/:id', OrganizationContactController.getById);
router.get('/by-company/:id_company', OrganizationContactController.getByCompanyId);

router.post('/', OrganizationContactController.createWithUser);

router.patch('/:id', OrganizationContactController.update);

router.delete('/:id', OrganizationContactController.delete);

export default router;
// Exportar el router para su uso en la aplicación principal
// export { router as organizationContactRoutes };
// Asegúrate de que las validaciones y controladores estén correctamente definidos e importados.
// app.use(express.json()); // Middleware para procesar JSON

// Manejo de errores global