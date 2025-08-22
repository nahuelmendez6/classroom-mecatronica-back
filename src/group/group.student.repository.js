import GroupStudent from './group.student.model.js';
import Student from '../student/student.model.js';
import Group from '../group/group.model.js';
import Organization from '../organization/organization.model.js';

const groupStudentRepository = {
  async findAll() {
  try {
    return await GroupStudent.findAll({
      include: [
        {
          model: Student,
          attributes: ['id_student', 'name', 'lastname', 'dni', 'phone_number']
        },
        {
          model: Group,
          attributes: ['id_group', 'group_name'],
          include: [
            {
              model: Organization,
              attributes: ['id_organization', 'name']
            }
          ]
        }
      ]
    });
  } catch (error) {
    console.error('Error in findAll:', error);
    throw new Error('Error fetching group-student records');
  }
}
,
  

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
