// controllers/attendanceController.js
import AttendanceRepository from './attendance.repository.js';

const AttendanceController = {
  async create(req, res) {
    try {
      const data = req.body;
      const attendance = await AttendanceRepository.create(data);
      res.status(201).json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear asistencia', error });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const attendance = await AttendanceRepository.findById(id);

      if (!attendance) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }

      res.json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener asistencia', error });
    }
  },

  async getByStudent(req, res) {
    try {
      const { studentId } = req.params;
      const attendances = await AttendanceRepository.findByStudentId(studentId);
      res.json(attendances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener asistencias del estudiante', error });
    }
  },

  async getByOrganization(req, res) {
    try {
      const { organizationId } = req.params;
      const attendances = await AttendanceRepository.findByOrganizationId(organizationId);
      res.json(attendances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener asistencias de la organización', error });
    }
  },

  async getAll(req, res) {
    try {
      const attendances = await AttendanceRepository.findAll();
      res.json(attendances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al listar asistencias', error });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const rowsUpdated = await AttendanceRepository.update(id, data);

      if (rowsUpdated === 0) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }

      res.json({ message: 'Asistencia actualizada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar asistencia', error });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const rowsDeleted = await AttendanceRepository.delete(id);

      if (rowsDeleted === 0) {
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }

      res.json({ message: 'Asistencia eliminada correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar asistencia', error });
    }
  },
};

export default AttendanceController;
