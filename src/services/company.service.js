import CompanyAddress from '../models/company.address.model.js';
import CompanyContact from '../models/company.contact.model.js';
import Company from '../models/company.model.js';
import Agreement from '../models/agreement.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class CompanyService {
  static async getAllCompanies() {
    try {
      const companies = await Company.findAll({
        include: [
          { model: CompanyAddress },
          { model: CompanyContact },
          { model: Agreement }
        ]
      });
      return companies;
    } catch (error) {
      throw new AppError('Error al obtener las empresas', 500);
    }
  }

  static async getCompanyById(id) {
    const company = await Company.findByPk(id);
    if (!company) {
      throw new NotFoundError('Empresa');
    }
    return company;
  }

  static async createCompany(companyData) {
    try {
      const newCompany = await Company.create(companyData);
      return newCompany;
    } catch (error) {
      throw new AppError('Error al crear la empresa', 500);
    }
  }

  static async updateCompany(id, companyData) {
    try {
      const company = await Company.findByPk(id);
      if (!company) {
        throw new NotFoundError('Empresa');
      }
      const updatedCompany = await company.update(companyData);
      return updatedCompany;
    } catch (error) {
      throw new AppError('Error al actualizar la empresa', 500);
    }
  }

  static async softDeleteCompany(id) {
    try {
      const company = await Company.findByPk(id);
      if (!company) {
        throw new NotFoundError('Empresa');
      }
      await company.update({ is_deleted: true });
    } catch (error) {
      throw new AppError('Error al eliminar la empresa', 500);
    }
  }
}

export default CompanyService;
