import CompanyContact from '../models/company.contact.model.js';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js'; // Import the User model
import Role from '../models/role.model.js';
import sequelize from '../config/sequalize.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

class CompanyContactService {

    static async createCompanyContactWithUser(contactData) {
        const transaction = await sequelize.transaction();
        try {
            const { email, password, name, lastname, dni, phone_number, id_company } = contactData;

            const companyContactRole = await Role.findOne({ where: { name: 'Tutor' } });
            if (!companyContactRole) {
                throw new NotFoundError('Rol de contacto de empresa no encontrado');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                email,
                password: hashedPassword,
                name,
                lastname,
                dni,
                phone_number,
                id_role: companyContactRole.id_role,
            }, { transaction });

            const newCompanyContact = await CompanyContact.create({
                id_user: newUser.id_user,
                id_company,
            }, { transaction });

            await transaction.commit();
            return { newUser, newCompanyContact };
        } catch (error) {
            await transaction.rollback();
            throw new AppError(`Error al crear contacto de empresa con usuario: ${error.message}`, 500);
        }
    }

}

export default CompanyContactService;