import CompanyAddress from '../models/company.address.model.js';
import Company from '../models/company.model.js';

export async function createCompanyAddress(req, res) {

    try {
        const { street, number, city, department, id_company } = req.body;


        // validación básica
        if (!street || !number || !city || !department || !id_company) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos obligatorios'
                });
        }

        // Verifica si la empresa existe
        const company = await Company.findByPk(id_company);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'La empresa no existe'
                });
        }

        // Crea la direccion

        const address = await CompanyAddress.create({
            street,
            number,
            city,
            department,
            id_company
        });

        return res.status(201).json({
            success: true,
            data: address
        });

    } catch (error) {
        console.error(error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'El id_company proporcionado no es valido'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Error de la validacion',
                errors: error.errors.map(e => e.message)
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
            error: error.message
        });

    }

}

export async function getCompanyAddressesByCompanyId(req, res) {
    const { id_company } = req.params;

    try {
        // Verifica si la empresa existe
        const company = await Company.findByPk(id_company);
        if (!company) {
            return res.status(404).json({
                success: false,
                message: 'Empresa no encontrada'
            });
        }

        // Busca las direcciones asociadas a esa empresa
        const addresses = await CompanyAddress.findAll({
            where: { id_company }
        });

        return res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Error al obtener direcciones',
            error: error.message
        });
    }
}
