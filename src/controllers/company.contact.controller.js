import CompanyContact from '../models/company.contact.model.js';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';
import { validationResult } from 'express-validator';

export const createCompanyContact = async (req, res) => {
  try {
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
      last_name,
      email,
      position,
      phone,
      id_company
    } = req.body;

    // Verificar si la empresa existe
    const company = await Company.findByPk(id_company);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Empresa no encontrada'
      });
    }

    // Crear el usuario y el contacto en una transacción
    const result = await User.createUser({
      email,
      name,
      lastname: last_name,
      id_role: 4, // ID del rol de Tutor Empresa
      id_company,
      position,
      phone
    });

    res.status(201).json({
      success: true,
      message: 'Contacto creado correctamente',
      data: { id_user: result }
    });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al crear el contacto',
      error: error.message
    });
  }
};

export const getCompanyContacts = async (req, res) => {
  try {
    const contacts = await CompanyContact.findAll({
      include: [
        {
          model: User,
          attributes: ['email', 'is_active']
        },
        {
          model: Company,
          attributes: ['name', 'cuit']
        }
      ]
    });

    res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los contactos',
      error: error.message
    });
  }
};

export const getCompanyContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await CompanyContact.findByPk(id, {
      include: [
        {
          model: User,
          attributes: ['email', 'is_active']
        },
        {
          model: Company,
          attributes: ['name', 'cuit']
        }
      ]
    });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el contacto',
      error: error.message
    });
  }
};

export const updateCompanyContact = async (req, res) => {
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
    const contact = await CompanyContact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    await contact.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Contacto actualizado correctamente',
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el contacto',
      error: error.message
    });
  }
};

export const deleteCompanyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await CompanyContact.findByPk(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contacto no encontrado'
      });
    }

    // Obtener el usuario asociado
    const user = await User.findByPk(contact.id_user);
    if (user) {
      await user.update({ is_active: false, is_deleted: true });
    }

    res.status(200).json({
      success: true,
      message: 'Contacto eliminado correctamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el contacto',
      error: error.message
    });
  }
};
