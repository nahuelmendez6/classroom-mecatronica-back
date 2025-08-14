import OrganizationAgreement from './organization.agreement.model.js';

const OrganizationAgreementRepository = {
  
  async create(data) {
    return await OrganizationAgreement.create(data);
  },

  async findAll() {
    return await OrganizationAgreement.findAll();
  },

  async findById(id) {
    return await OrganizationAgreement.findByPk(id);
  },

  async update(id, data) {
    const agreement = await OrganizationAgreement.findByPk(id);
    if (!agreement) return null;
    return await agreement.update(data);
  },

  async delete(id) {
    const agreement = await OrganizationAgreement.findByPk(id);
    if (!agreement) return null;
    await agreement.destroy();
    return true;
  }
};

export default OrganizationAgreementRepository;
