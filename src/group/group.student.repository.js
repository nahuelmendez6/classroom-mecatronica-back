import GroupStudent from './group.student.model.js';

const groupStudentRepository = {
  async findAll() {
    return await GroupStudent.findAll();
  },

  async findByGroupId(id_group) {
    return await GroupStudent.findAll({ where: { id_group } });
  },

  async findByStudentId(id_student) {
    return await GroupStudent.findAll({ where: { id_student } });
  },

  async findByCompositeKey(id_group, id_student) {
    return await GroupStudent.findOne({ where: { id_group, id_student } });
  },

  async create(data) {
    return await GroupStudent.create(data);
  },

  async delete(id_group, id_student) {
    const record = await GroupStudent.findOne({ where: { id_group, id_student } });
    if (!record) return null;
    await record.destroy();
    return record;
  }
};

export default groupStudentRepository;
