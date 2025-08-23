// repositories/attendanceRepository.js
import Attendance from './attendance.model.js';

const AttendanceRepository = {
  async create(data) {
    return await Attendance.create(data);
  },

  async findById(id) {
    return await Attendance.findByPk(id);
  },

  async findByStudentId(studentId) {
    return await Attendance.findAll({
      where: { id_student: studentId },
      order: [['attendance_date', 'DESC']],
    });
  },

  async findAll(filter = {}) {
    return await Attendance.findAll({
      where: filter,
      order: [['attendance_date', 'DESC']],
    });
  },

  async update(id, data) {
    const [rowsUpdated] = await Attendance.update(data, {
      where: { id_attendance: id },
    });
    return rowsUpdated; // devuelve cuántas filas se actualizaron
  },

  async delete(id) {
    return await Attendance.destroy({
      where: { id_attendance: id },
    });
  },
};

export default AttendanceRepository;
