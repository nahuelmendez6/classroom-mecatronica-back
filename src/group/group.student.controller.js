import groupStudentRepository from './group.student.repository.js';

const groupStudentController = {
  async getAll(req, res) {
    try {
      const records = await groupStudentRepository.findAll();
      res.json(records);
    } catch (error) {
      console.error('Error fetching GroupStudents:', error);
      res.status(500).json({ error: 'Error fetching group-student records' });
    }
  },

  async getByGroupId(req, res) {
    try {
      const { id_group } = req.params;
      const records = await groupStudentRepository.findByGroupId(id_group);
      res.json(records);
    } catch (error) {
      console.error('Error fetching students by group:', error);
      res.status(500).json({ error: 'Error fetching students by group' });
    }
  },

  async getByStudentId(req, res) {
    try {
      const { id_student } = req.params;
      const records = await groupStudentRepository.findByStudentId(id_student);
      res.json(records);
    } catch (error) {
      console.error('Error fetching groups by student:', error);
      res.status(500).json({ error: 'Error fetching groups by student' });
    }
  },

  async create(req, res) {
    try {
      const { id_group, id_student } = req.body;

      if (!id_group || !id_student) {
        return res.status(400).json({ error: 'id_group and id_student are required' });
      }

      const existing = await groupStudentRepository.findByCompositeKey(id_group, id_student);
      if (existing) {
        return res.status(409).json({ error: 'Relation already exists' });
      }

      const newRecord = await groupStudentRepository.create({ id_group, id_student });
      res.status(201).json(newRecord);
    } catch (error) {
      console.error('Error creating group-student relation:', error);
      res.status(500).json({ error: 'Error creating group-student relation' });
    }
  },

  async delete(req, res) {
    try {
      const { id_group, id_student } = req.params;
      const deleted = await groupStudentRepository.delete(id_group, id_student);
      if (!deleted) {
        return res.status(404).json({ error: 'Relation not found' });
      }
      res.json({ message: 'Relation deleted successfully' });
    } catch (error) {
      console.error('Error deleting group-student relation:', error);
      res.status(500).json({ error: 'Error deleting group-student relation' });
    }
  }
};

export default groupStudentController;
