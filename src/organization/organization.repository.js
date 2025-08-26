import Organization from "./organization.model.js";
import OrganizationContact from "./organization.contact.model.js";

export async function findAll() {
    return await Organization.findAll({
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
        include: [
            {
                model: OrganizationContact,
                attributes: ['id_contact', 'name', 'last_name', 'email', 'phone'], // ajustá según tus columnas reales
                as: 'contacts', // asegúrate de que este alias coincida con el definido en la asociación
                required: false 
            }
        ]
    }); 
}

export async function findById(id) {
    return await Organization.findOne({
        where: { id_organization: id },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}

export async function create(organizationData) {
    return await Organization.create(organizationData);
}

export async function update(id, organizationData) {
    return await Organization.update(organizationData, {
        where: { id_organization: id }
    });
}

export async function deleteById(id) {
    return await Organization.destroy({
        where: { id_organization: id }
    });
}

export async function findByCuit(cuit) {
    return await Organization.findOne({
        where: { cuit },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}

export async function findByName(name) {
    return await Organization.findAll({
        where: { name },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}
export async function findBySector(sector) {
    return await Organization.findAll({
        where: { sector },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}

export async function findBySize(size) {
    return await Organization.findAll({
        where: { size },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}

export async function findDeleted() {
    return await Organization.findAll({
        where: { is_deleted: true },
        attributes: ['id_organization', 'name', 'cuit', 'sector', 'description', 'size', 'is_deleted'],
    });
}

export async function restore(id) {
    return await Organization.update({ is_deleted: false }, {
        where: { id_organization: id }
    });
}

export async function findContacts(organizationId) {
    return await OrganizationContact.findAll({
        where: { id_organization: organizationId },
        include: [{ model: User, attributes: ['id_user', 'name', 'email'] }]
    });
}

export async function findAddresses(organizationId) {
    return await OrganizationAddress.findAll({
        where: { id_organization: organizationId }
    });
}

export async function findAgreements(organizationId) {
    return await Agreement.findAll({
        where: { id_organization: organizationId }
    });
}

export async function findPracticeAssignments(organizationId) {
    return await StudentPracticeAssignment.findAll({
        where: { id_organization: organizationId }
    });
}
export async function findModules(organizationId) {
    return await Module.findAll({
        include: [{
            model: StudentPracticeAssignment,
            where: { id_organization: organizationId }
        }]
    });
}
export async function findCourses(organizationId) {
    return await Course.findAll({
        include: [{
            model: StudentPracticeAssignment,
            where: { id_organization: organizationId }
        }]
    });
}   