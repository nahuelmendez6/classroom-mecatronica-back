import Company from "../models/company.model.js"
import { validationResult } from 'express-validator';
import CompanyContact from "../models/company.contact.model.js";
import User from "../models/user.model.js";
import CompanyAddress from "../models/company.address.model.js";


import sequelize from '../config/sequalize.js';

export const createCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: errors.array()
            });
        }

        const company = await Company.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Empresa creada exitosamente',
            data: company
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'El CUIT ya existe'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al crear la empresa',
            error: error.message
        });
    }
};

export const getCompanies = async (req, res) => {
    try {
        const companies = await Company.findAll({
            include: [
                {
                    model: CompanyContact,
                    include: [{
                        model: User,
                        attributes: ['email', 'is_active']
                    }]
                },
                CompanyAddress
            ]
        });

        res.status(200).json({
            success: true,
            data: companies
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las empresas',
            error: error.message
        });
    }
};

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id, {
            include: [
                {
                    model: CompanyContact,
                    include: [{
                        model: User,
                        attributes: ['email', 'is_active']
                    }]
                },
                CompanyAddress,
                Agreement
            ]
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            data: company
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la empresa',
            error: error.message
        });
    }
};

export const updateCompany = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Error de validación',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const company = await Company.findByPk(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        await company.update(req.body);

        res.status(200).json({
            success: true,
            message: 'Empresa actualizada exitosamente',
            data: company
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'El CUIT ya existe'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la empresa',
            error: error.message
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findByPk(id);

        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        // Obtener todos los contactos asociados
        const contacts = await CompanyContact.findAll({
            where: { id_company: id },
            include: [User]
        });

        // Desactivar usuarios asociados
        for (const contact of contacts) {
            if (contact.User) {
                await contact.User.update({ is_active: false, is_deleted: true });
            }
        }

        res.status(200).json({
            success: true,
            message: 'Empresa eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la empresa',
            error: error.message
        });
    }
};

export const createCompanyWithAddressAndContact = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: errors.array()
      });
    }
  
    const {
      name,
      cuit,
      street,
      number,
      city,
      department,
      contact_name,
      contact_last_name,
      contact_email,
      contact_position,
      contact_phone
    } = req.body;
  
    const transaction = await sequelize.transaction();
  
    try {
      // Crear empresa
      const company = await Company.create({ name, cuit }, { transaction });
  
      // Crear dirección
      const address = await CompanyAddress.create({
        street,
        number,
        city,
        department,
        id_company: company.id
      }, { transaction });
  
      // Crear usuario/contacto
      const user = await User.createUser({
        email: contact_email,
        name: contact_name,
        lastname: contact_last_name,
        id_role: 4,
        id_company: company.id,
        position: contact_position,
        phone: contact_phone
      }, transaction); // Asegurate que `createUser` acepte transaction como segundo parámetro
  
      await transaction.commit();
  
      return res.status(201).json({
        success: true,
        message: 'Empresa, dirección y contacto creados correctamente',
        data: {
          company,
          address,
          user_id: user
        }
      });
  
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error al crear empresa completa',
        error: error.message
      });
    }
  };