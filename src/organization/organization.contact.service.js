import sequelize from '../config/sequalize.js';
import bcrypt from 'bcryptjs/dist/bcrypt.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import OrganizationContact from './organization.contact.model.js';




// Métodos básicos omitidos por brevedad (findAll, findById, etc.)

export async function createOrganizationContactWithUser(contactData) {
  const t = await sequelize.transaction();
  try {
    const {
      email,
      password,
      name,
      last_name,
      dni,
      phone,
      id_company,
      position
    } = contactData;

    const finalPassword = password || dni;

    const orgRole = await Role.findOne({ where: { name: 'Tutor' } }, { transaction: t });
    if (!orgRole) {
      throw new AppError("The 'Organización' role is not configured in the system.", 500);
    }

    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // 1. Crear el usuario
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      lastname: last_name,
      dni,
      phone_number: phone,
      id_role: orgRole.id_role
    }, { transaction: t });

    // 2. Crear el contacto de organización
    const newContact = await OrganizationContact.create({
      name,
      last_name,
      email,
      position,
      phone,
      id_user: newUser.id_user,
      id_company
    }, { transaction: t });

    await t.commit();
    return newContact;

  } catch (error) {
    console.error("Error completo en createOrganizationContactWithUser:", error);
    await t.rollback();

    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new AppError('Email or DNI already registered.', 409);
    }

    console.error("Error in createOrganizationContactWithUser:", error);
    throw new AppError('Internal server error while creating the organization contact.', 500);
  }
}


export async function getAllOrganizationContacts() {
  return await OrganizationContact.findAll({
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function getOrganizationContactById(id) {
  return await OrganizationContact.findOne({
    where: { id_contact: id },
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}

export async function updateOrganizationContact(id, contactData) {

  // update tambien se usa para 'soft-delete' 

  return await OrganizationContact.update(contactData, {
    where: { id_contact: id },
  });
}

export async function deleteOrganizationContactById(id) {
  return await OrganizationContact.destroy({
    where: { id_contact: id },
  });
}

export async function getContactsByCompanyId(id_company) {
  return await OrganizationContact.findAll({
    where: { id_company },
    attributes: ['id_contact', 'name', 'last_name', 'email', 'position', 'phone', 'id_user', 'id_company'],
  });
}