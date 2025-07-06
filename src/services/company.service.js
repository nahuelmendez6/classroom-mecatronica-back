import Company from '../models/company.model.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class CompanyService {
  static async getAllCompanies() {
    try {
      const companies = await Company.findAll();
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

  static async deleteCompany(id) {
    try {
      const company = await Company.findByPk(id);
      if (!company) {
        throw new NotFoundError('Empresa');
      }
      await company.destroy();
    } catch (error) {
      throw new AppError('Error al eliminar la empresa', 500);
    }
  }
}

export default CompanyService;
