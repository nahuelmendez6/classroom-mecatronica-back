import StudentEnsuranceRepository from '../repositories/studentEnsuranceRepository.js';

const StudentEnsuranceController = {
  // Crear un nuevo seguro de estudiante
  async create(req, res) {
    try {
      const data = req.body;
      const newRecord = await StudentEnsuranceRepository.create(data);
      res.status(201).json(newRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los seguros
  async getAll(req, res) {
    try {
      const records = await StudentEnsuranceRepository.findAll();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un seguro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await StudentEnsuranceRepository.findById(id);
      if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener por estudiante y año
  async getByStudentAndYear(req, res) {
    try {
        const { id_student, year } = req.params;
        const record = await StudentEnsuranceRepository.findByStudentAndYear(id_student, year);
        if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(record);   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un seguro por ID
  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const updatedRecord = await StudentEnsuranceRepository.update(id, data);
      if (!updatedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(updatedRecord);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Eliminar un seguro por ID
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deletedRecord = await StudentEnsuranceRepository.delete(id);
      if (!deletedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default StudentEnsuranceController;
