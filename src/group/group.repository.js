import Group from './group.model.js';

const groupRepository = {
  async findAll() {
    return await Group.findAll();
  },

  async findById(id_group) {
    return await Group.findByPk(id_group);
  },

  async create(data) {
    return await Group.create(data);
  },

  async update(id_group, data) {
    const group = await Group.findByPk(id_group);
    if (!group) return null;
    return await group.update(data);
  },

  async delete(id_group) {
    const group = await Group.findByPk(id_group);
    if (!group) return null;
    await group.destroy();
    return group;
  },

  async findByCourseId(id_course) {
    return await Group.findAll({ where: { id_course } });
  },

  async findByOrganzationId(id_company) {
    return await Group.findAll({ where: { id_organization } });
  }
};

export default groupRepository;
