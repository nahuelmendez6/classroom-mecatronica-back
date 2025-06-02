import CompanyContact from '../models/company.contact.model.js';
import User from '../models/user.model.js';
import Company from '../models/company.model.js';

export const createCompanyContact = async (req, res) => {
  try {
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
      return res.status(404).json({ message: 'Empresa no encontrada.' });
    }

    // Crear el nuevo usuario
    const newUser = await User.create({
      email,
      dni,
      email
      // Otros campos de usuario si hay (ej. password, rol, etc.)
    });

    // Crear el contacto de la empresa con el id del usuario recién creado
    const newContact = await CompanyContact.create({
      name,
      last_name,
      email,
      position,
      phone,
      id_user: newUser.id_user,
      id_company
    });

    res.status(201).json({
      message: 'Contacto creado correctamente.',
      user: newUser,
      contact: newContact
    });
  } catch (error) {
    console.error('Error al crear contacto:', error);
    res.status(500).json({ message: 'Error interno al crear el contacto.' });
  }
};
