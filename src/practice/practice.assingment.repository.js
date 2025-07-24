import PracticeAssignment from './practice.assignment.model.js';
import Student from '../student/student.model.js';
import Group from '../group/group.model.js';
import Organization from '../organization/organization.model.js';

const PracticeAssignmentRepository = {
  async create(data) {
    return await PracticeAssignment.create(data);
  },

  async findById(id) {
    return await PracticeAssignment.findByPk(id, {
      include: [
        { model: Student, as: 'student' },
        { model: Group, as: 'group' },
        { model: Organization, as: 'organization' }
      ]
    });
  },

  async findByGroupId(id) {
    const assignments = await PracticeAssignment.findAll({
      where: { id_group: id }
    });
    return assignments;
  },

  async findAll() {
    return await PracticeAssignment.findAll({
      include: [
        { model: Student, as: 'student' },
        { model: Group, as: 'group' },
        { model: Organization, as: 'organization' }
      ],
      order: [['created_at', 'DESC']]
    });
  },

  async update(id, data) {
    const assignment = await PracticeAssignment.findByPk(id);
    if (!assignment) return null;
    return await assignment.update(data);
  },

  async delete(id) {
    const assignment = await PracticeAssignment.findByPk(id);
    if (!assignment) return null;
    await assignment.destroy();
    return true;
  }
};

export default PracticeAssignmentRepository;
