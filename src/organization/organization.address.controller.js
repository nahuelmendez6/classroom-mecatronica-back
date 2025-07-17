import {
    create,
    update,
    deleteById,
    findAll,
    findByOrganizationId    
} from "./organization.address.repository.js";


import { asyncHandler } from '../utils/errorHandler.js';


class OrganizationAddressController {

    static create = asyncHandler(async (req, res) => {
        const organizationAddress = await create(req.body);
        res.status(201).json({
            message: 'Organization address created successfully',
            data: organizationAddress
        });
    });

    static getAll = asyncHandler(async (req, res) => {
        const organizationAddresses = await findAll();
        res.status(200).json({
            message: 'Organization addresses retrieved successfully',
            data: organizationAddresses
        });
    });

    static getByOrganizationId = asyncHandler(async (req, res) => {
        const organizationAddresses = await findByOrganizationId(req.params.id);
        if (!organizationAddresses || organizationAddresses.length === 0) {
            return res.status(404).json({ message: 'No addresses found for this organization' });
        }
        res.status(200).json({
            message: 'Organization addresses retrieved successfully',
            data: organizationAddresses
        });
    });

    static update = asyncHandler(async (req, res) => {
        const updatedOrganizationAddress = await update(req.params.id, req.body);
        if (!updatedOrganizationAddress[0]) {
            return res.status(404).json({ message: 'Organization address not found or no changes made' });
        }
        res.status(200).json({
            message: 'Organization address updated successfully',
            data: updatedOrganizationAddress
        });
    });

    static delete = asyncHandler(async (req, res) => {
        const deleted = await deleteById(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Organization address not found' });
        }
        res.status(200).json({
            message: 'Organization address deleted successfully'
        });
    }); 

}

export default OrganizationAddressController;