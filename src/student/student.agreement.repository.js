import StudentAgreement from "./student.agreement.js";
import Student from "./student.model.js";

class StudentAgreementRepository {
  // Crear un nuevo acuerdo
  async create(data) {
    return await StudentAgreement.create(data);
  }

  // Buscar todos los acuerdos
  async findAll() {
    return await StudentAgreement.findAll({
      include: [{ model: Student, as: "student" }]
    });
  }

  // Buscar por ID
  async findById(id) {
    return await StudentAgreement.findByPk(id, {
      include: [{ model: Student, as: "student" }]
    });
  }

  // Buscar por estudiante y año
  async findByStudentAndYear(id_student, year) {
    return await StudentAgreement.findOne({
      where: { id_student, year },
      include: [{ model: Student, as: "student" }]
    });
  }

  // Actualizar
  async update(id, data) {
    const agreement = await StudentAgreement.findByPk(id);
    if (!agreement) return null;
    return await agreement.update(data);
  }

  // Eliminar
  async delete(id) {
    const agreement = await StudentAgreement.findByPk(id);
    if (!agreement) return null;
    await agreement.destroy();
    return agreement;
  }
}

export default new StudentAgreementRepository();
