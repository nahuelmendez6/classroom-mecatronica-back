import OrganizationContact from './organizationContact.model.js';
import User from '../models/user.model.js';

export async function findAll() {
  return await OrganizationContact.findAll({
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function findById(id) {
  return await OrganizationContact.findOne({
    where: { id_contact: id },
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function create(contactData) {
  return await OrganizationContact.create(contactData);
}

export async function update(id, contactData) {
  return await OrganizationContact.update(contactData, {
    where: { id_contact: id },
  });
}

export async function deleteById(id) {
  return await OrganizationContact.destroy({
    where: { id_contact: id },
  });
}

export async function findByCompanyId(id_company) {
  return await OrganizationContact.findAll({
    where: { id_company },
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function findByUserId(id_user) {
  return await OrganizationContact.findAll({
    where: { id_user },
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function findWithUserInfoByCompany(id_company) {
  return await OrganizationContact.findAll({
    where: { id_company },
    include: [
      {
        model: User,
        attributes: ['id_user', 'name', 'email'],
      },
    ],
  });
}
