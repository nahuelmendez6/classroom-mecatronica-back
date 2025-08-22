import groupRepository from './group.repository.js';

const groupController = {
  async getAllGroups(req, res) {
    try {
      const groups = await groupRepository.findAll();
      res.json(groups);
    } catch (error) {
      console.error('Error getting groups:', error);
      res.status(500).json({ error: 'Error retrieving groups' });
    }
  },

  async getGroupById(req, res) {
    try {
      const { id } = req.params;
      const group = await groupRepository.findById(id);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      res.json(group);
    } catch (error) {
      console.error('Error getting group by ID:', error);
      res.status(500).json({ error: 'Error retrieving group' });
    }
  },

  async createGroup(req, res) {
    try {
        console.log('BODY RECIBIDO:', req.body);

      const newGroup = await groupRepository.create(req.body);
      res.status(201).json(newGroup);
    } catch (error) {
      console.error('Error creating group:', error);
      res.status(500).json({ error: 'Error creating group' });
    }
  },

  async updateGroup(req, res) {
    try {
      const { id } = req.params;
      const updatedGroup = await groupRepository.update(id, req.body);
      if (!updatedGroup) {
        return res.status(404).json({ error: 'Group not found' });
      }
      res.json(updatedGroup);
    } catch (error) {
      console.error('Error updating group:', error);
      res.status(500).json({ error: 'Error updating group' });
    }
  },

  async deleteGroup(req, res) {
    try {
      const { id } = req.params;
      const deletedGroup = await groupRepository.delete(id);
      if (!deletedGroup) {
        return res.status(404).json({ error: 'Group not found' });
      }
      res.json({ message: 'Group deleted successfully' });
    } catch (error) {
      console.error('Error deleting group:', error);
      res.status(500).json({ error: 'Error deleting group' });
    }
  },

  async getGroupsByCourse(req, res) {
    try {
      const { id_course } = req.params;
      const groups = await groupRepository.findByCourseId(id_course);
      res.json(groups);
    } catch (error) {
      console.error('Error getting groups by course:', error);
      res.status(500).json({ error: 'Error retrieving groups by course' });
    }
  },

   async getByCourse(req, res) {
    try {
      const { id_course } = req.params;
      const records = await groupRepository.findGroupByCourse(id_course);
      res.json(records);
    } catch (error) {
      console.error('Error fetching groups by course:', error);
      res.status(500).json({ error: 'Error fetching groups by course' });
    }
  },

  async getGroupsByOrganization(req, res) {
    try {
      const { id_organization } = req.params;
      const groups = await groupRepository.findByOrganizationId(id_organization);
      res.json(groups);
    } catch (error) {
      console.error('Error getting groups by company:', error);
      res.status(500).json({ error: 'Error retrieving groups by company' });
    }
  }
};

export default groupController;
