import OrganizationAgreementRepository from './organization.agreement.repository.js';

const OrganizationAgreementController = {

  async create(req, res) {
    try {
      if (req.file) {
        req.body.document_url = req.file.path;
      }
      const newAgreement = await OrganizationAgreementRepository.create(req.body);
      res.status(201).json(newAgreement);
    } catch (error) {
      res.status(500).json({ message: 'Error creating agreement', error: error.message });
    }
  },

  async getAll(req, res) {
    try {
      const agreements = await OrganizationAgreementRepository.findAll();
      res.json(agreements);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching agreements', error: error.message });
    }
  },

  async getById(req, res) {
    try {
      const agreement = await OrganizationAgreementRepository.findById(req.params.id);
      if (!agreement) return res.status(404).json({ message: 'Agreement not found' });
      res.json(agreement);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching agreement', error: error.message });
    }
  },

  async update(req, res) {
    try {
      if (req.file) {
        req.body.document_url = req.file.path;
      }
      const updated = await OrganizationAgreementRepository.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Agreement not found' });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating agreement', error: error.message });
    }
  },

  async delete(req, res) {
    try {
      const deleted = await OrganizationAgreementRepository.delete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Agreement not found' });
      res.json({ message: 'Agreement deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting agreement', error: error.message });
    }
  }
};

export default OrganizationAgreementController;
