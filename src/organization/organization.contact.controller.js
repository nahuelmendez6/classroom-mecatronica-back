import {
    createOrganizationContactWithUser,
    getAllOrganizationContacts,
    getOrganizationContactById,
    updateOrganizationContact,
    deleteOrganizationContactById,
    getContactsByCompanyId
} from  './organization.contact.service.js';

import { findAttendancesByContactId } from './organization.contact.repository.js';

import { asyncHandler } from '../utils/errorHandler.js';

import { sendSuccess } from '../utils/responseHandler.js';

class OrganizationContactController {

    static createWithUser = asyncHandler(async (req, res) => {
        const contactData = req.body;
        const newContact = await createOrganizationContactWithUser(contactData);
        sendSuccess(res, 201, 'Organization contact created successfully with user', newContact);
    });

    static getAll = asyncHandler(async (req, res) => {
        const contacts = await getAllOrganizationContacts();
        sendSuccess(res, 200, 'Organization contacts retrieved successfully', contacts);
    });

    static getById = asyncHandler(async (req, res) => {
        const contact = await getOrganizationContactById(req.params.id);
        if (!contact) {
            return sendError(res, 404, 'Organization contact not found');
        }
        sendSuccess(res, 200, 'Organization contact retrieved successfully', contact);
    });

    static getAttendancesByContactId = asyncHandler(async (req, res) => {
        const contactId = req.params.id;
        const attendances = await findAttendancesByContactId(contactId);
        sendSuccess(res, 200, 'Attendances retrieved successfully', attendances);
    });

    static update = asyncHandler(async (req, res) => {
        const updatedContact = await updateOrganizationContact(req.params.id, req.body);
        if (!updatedContact[0]) {
            return sendError(res, 404, 'Organization contact not found or no changes made');
        }
        sendSuccess(res, 200, 'Organization contact updated successfully', updatedContact);
    });

    static delete = asyncHandler(async (req, res) => {
        const deleted = await deleteOrganizationContactById(req.params.id);
        if (!deleted) {
            return sendError(res, 404, 'Organization contact not found');
        }
        sendSuccess(res, 200, 'Organization contact deleted successfully');
    });

    static getByCompanyId = asyncHandler(async (req, res) => {
        const contacts = await getContactsByCompanyId(req.params.id_company);
        sendSuccess(res, 200, 'Contacts by company retrieved successfully', contacts);
    }); 

}

export default OrganizationContactController;