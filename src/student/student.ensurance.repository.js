import StudentEnsurance from '../models/StudentEnsurance.js';
import Student from "./student.model.js";

const StudentEnsuranceRepository = {
  // Crear un nuevo registro
  async create(data) {
    return await StudentEnsurance.create(data);
  },

  // Obtener todos los registros
  async findAll() {
    return await StudentEnsurance.findAll();
  },

  // Obtener un registro por ID
  async findById(id) {
    return await StudentEnsurance.findByPk(id);
  },

  async findByStudentAndYear(id_student, year) {
    return await StudentEnsurance.findOne({
      where: { id_student, year },
      include: [{ model: Student, as: "student" }]
    });
  },

  // Actualizar un registro por ID
  async update(id, data) {
    const record = await StudentEnsurance.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  },

  // Eliminar un registro por ID
  async delete(id) {
    const record = await StudentEnsurance.findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  }
};

export default StudentEnsuranceRepository;
