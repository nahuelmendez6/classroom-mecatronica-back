import { createStudentWithUser } from './student.service.js';
import StudentRepository from './student.repository.js';

class StudentController {
  // Crear estudiante junto a su usuario
  async create(req, res) {
    try {
      const student = await createStudentWithUser(req.body);
      return res.status(201).json(student);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  // Obtener todos los estudiantes
  async findAll(req, res) {
    try {
      const students = await StudentRepository.findAll();
      return res.status(200).json(students);
    } catch (error) {
      console.error('ERROR EN findAll:', error);
        return res.status(500).json({ message: 'Error al obtener los estudiantes' });
    }
  }

  // Obtener un estudiante por ID
  async findById(req, res) {
    try {
      const { id } = req.params;
      const student = await StudentRepository.findById(id);
      if (!student) {
        return res.status(404).json({ message: 'Estudiante no encontrado' });
      }
      return res.status(200).json(student);
    } catch (error) {
        console.error('ERROR EN findAll:', error);
      return res.status(500).json({ message: 'Error al obtener el estudiante' });
    }
  }

  // Actualizar datos del estudiante
  async update(req, res) {
    try {
      const { id } = req.params;
      const updatedStudent = await StudentRepository.update(id, req.body);
      return res.status(200).json(updatedStudent);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  // Eliminar estudiante (soft delete si preferís)
  async delete(req, res) {
    try {
      const { id } = req.params;
      await StudentRepository.delete(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: 'Error al eliminar el estudiante' });
    }
  }
}

export default new StudentController();
