import OrganizationAddress from "./organization.address.model.js";

export async function findAll() {
    return await OrganizationAddress.findAll({
        attributes: ['id_organization_address', 'id_organization', 'address', 'city', 'state', 'postal_code', 'country', 'is_deleted'],
    });
}

export async function findByOrganizationId(organizationId) {
    return await OrganizationAddress.findAll({
        where: { id_organization: organizationId },
        attributes: ['id_organization_address', 'id_organization', 'address', 'city', 'state', 'postal_code', 'country', 'is_deleted'],
    });
}

export async function create(organizationAddressData) {
    return await OrganizationAddress.create(organizationAddressData);
}

export async function update(id, organizationAddressData) {
    return await OrganizationAddress.update(organizationAddressData, {
        where: { id_organization_address: id }
    });
}

export async function deleteById(id) {
    return await OrganizationAddress.destroy({
        where: { id_organization_address: id }
    });
}