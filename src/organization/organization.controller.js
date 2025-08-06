import { asyncHandler } from '../utils/errorHandler.js';
import {
    findAll,
    findById,
    create,
    update,
    deleteById,
    findByCuit,
    findByName,
    findBySector,
    findBySize,
    findDeleted
} from './organization.repository.js';

class OrganizationController {

    static create = asyncHandler(async (req, res) => {
        const organization = await create(req.body);
        res.status(201).json({
            message: 'Organization created successfully',
            data: organization
        });
    });

    static getAll = asyncHandler(async (req, res) => {
        try {
            const organizations = await findAll();
            res.status(200).json({
                message: 'Organizations retrieved successfully',
                data: organizations
            });
        } catch (err) {
            console.error('🔥 Error en getAll:', err);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
                error: err.message,
                stack: err.stack
            });
        }
    });


    static getById = asyncHandler(async (req, res) => {
        const organization = await findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({
            message: 'Organization retrieved successfully',
            data: organization
        });
    });

    static update = asyncHandler(async (req, res) => {
        const updatedOrganization = await update(req.params.id, req.body);
        if (!updatedOrganization[0]) {
            return res.status(404).json({ message: 'Organization not found or no changes made' });
        }
        res.status(200).json({
            message: 'Organization updated successfully',
            data: updatedOrganization
        });
    });

    static delete = asyncHandler(async (req, res) => {
        const deleted = await deleteById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({
            message: 'Organization deleted successfully'
        });
    });

    static getByCuit = asyncHandler(async (req, res) => {
        const organization = await findByCuit(req.params.cuit);
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.status(200).json({
            message: 'Organization retrieved successfully',
            data: organization
        });
    });

    static getByName = asyncHandler(async (req, res) => {
        const organizations = await findByName(req.params.name);
        res.status(200).json({
            message: 'Organizations retrieved successfully',
            data: organizations
        });
    });

    static getBySector = asyncHandler(async (req, res) => {
        const organizations = await findBySector(req.params.sector);
        res.status(200).json({
            message: 'Organizations retrieved successfully',
            data: organizations
        });
    });

    static getBySize = asyncHandler(async (req, res) => {
        const organizations = await findBySize(req.params.size);
        res.status(200).json({
            message: 'Organizations retrieved successfully',
            data: organizations
        });
    });

    static getDeleted = asyncHandler(async (req, res) => {
        const deletedOrganizations = await findDeleted();
        res.status(200).json({
            message: 'Deleted organizations retrieved successfully',
            data: deletedOrganizations
        });
    });

    static restore = asyncHandler(async (req, res) => {
        // Implement restore logic if needed
        res.status(501).json({ message: 'Restore functionality not implemented yet' });
    });

    static softDelete = asyncHandler(async (req, res) => {
        // Implement soft delete logic if needed
        res.status(501).json({ message: 'Soft delete functionality not implemented yet' });
    });

    static updateWithUser = asyncHandler(async (req, res) => {
        // Implement update with user logic if needed
        res.status(501).json({ message: 'Update with user functionality not implemented yet' });
    });

    static createWithUser = asyncHandler(async (req, res) => {
        // Implement create with user logic if needed
        res.status(501).json({ message: 'Create with user functionality not implemented yet' });
    });

    static getAllWithUser = asyncHandler(async (req, res) => {
        // Implement get all with user logic if needed
        res.status(501).json({ message: 'Get all with user functionality not implemented yet' });
    });

    static getByIdWithUser = asyncHandler(async (req, res) => {
        // Implement get by ID with user logic if needed
        res.status(501).json({ message: 'Get by ID with user functionality not implemented yet' });
    });

}

export default OrganizationController;