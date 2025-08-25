import OrganizationContact from './organization.contact.model.js';
import User from '../models/user.model.js';
import Student from '../student/student.model.js';
import Attendance from '../attendance/attendance.model.js';
import { where } from 'sequelize';
import Organization from './organization.model.js';

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

export async function findAttendancesByContactId(id_contact) {
  const contact = await OrganizationContact.findOne({
    where: { id_contact },
    include: [
      {
        model: Organization, // 👈 primero traemos la organización
        as: 'organization',
        include: [
          {
            model: Attendance, // 👈 luego las asistencias
            as: 'attendances',
            include:[
              {
                model: Student,
                as: 'student',
                attributes: ['id_student', 'name', 'lastname'],
              }
            ]
          },
        ],
      },
    ],
  });

  return contact?.organization?.attendances || [];
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
