import PracticeAssignmentRepository from './practice.assingment.repository.js';

const practiceAssignmentController = {
  // Obtener todas las asignaciones
  async getAll(req, res) {
    try {
      const assignments = await PracticeAssignmentRepository.findAll();
      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error en getAll:', error);
        res.status(500).json({ error: 'Error al obtener las asignaciones.' });
    }
  },

  // Obtener una asignación por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const assignment = await PracticeAssignmentRepository.findById(id);
      if (!assignment) return res.status(404).json({ error: 'Asignación no encontrada.' });
      res.status(200).json(assignment);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la asignación.' });
    }
  },

  async getByGroup(req, res) {
    const { id_group } = req.params;
    try {
        const assignments = await PracticeAssignmentRepository.findByGroupId(id_group);
        res.json(assignments);
    } catch (error) {
        console.error('Error en getByGroup:', error);  // Mostrar error real en consola
        res.status(500).json({ error: 'Error al obtener asignaciones por grupo' });
    }
  },

  // Crear una nueva asignación
  async create(req, res) {
    try {
      const {
        id_student,
        id_group,
        id_organization,
        start_date,
        end_date,
        required_hours,
        objectives
      } = req.body;

      // Validación simple (puede reemplazarse por Joi o middleware)
      if (!id_organization || !start_date || !end_date) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      if (!id_student && !id_group) {
        return res.status(400).json({ error: 'Debe asociar al menos un estudiante o grupo.' });
      }

      const newAssignment = await PracticeAssignmentRepository.create({
        id_student,
        id_group,
        id_organization,
        start_date,
        end_date,
        required_hours,
        objectives
      });

      res.status(201).json(newAssignment);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la asignación.' });
    }
  },

  // Actualizar una asignación
  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await PracticeAssignmentRepository.update(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Asignación no encontrada.' });
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar la asignación.' });
    }
  },

  // Eliminar una asignación
  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await PracticeAssignmentRepository.delete(id);
      if (!deleted) return res.status(404).json({ error: 'Asignación no encontrada.' });
      res.status(200).json({ message: 'Asignación eliminada correctamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la asignación.' });
    }
  }
};

export default practiceAssignmentController;
