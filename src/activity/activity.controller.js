import activityRepository from './activity.repository.js';

const activityController = {
  // GET /activities
  async getAll(req, res) {
    try {
      const activities = await activityRepository.findAll();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las actividades' });
    }
  },

  // GET /activities/:id
  async getById(req, res) {
    try {
      const activity = await activityRepository.findById(req.params.id);
      if (!activity) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener la actividad' });
    }
  },

  // POST /activities
  async create(req, res) {
    try {
      const { body, files } = req;
      if (files) {
        body.attachments = files.map(file => file.path).join(',');
      }
      const newActivity = await activityRepository.create(body);
      res.status(201).json(newActivity);
    } catch (error) {
      res.status(400).json({ error: 'Error al crear la actividad' });
    }
  },

  // PUT /activities/:id
  async update(req, res) {
    try {
      const { body, files } = req;
      if (files) {
        body.attachments = files.map(file => file.path).join(',');
      }
      const updated = await activityRepository.update(req.params.id, body);
      if (!updated) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: 'Error al actualizar la actividad' });
    }
  },

  // DELETE /activities/:id
  async remove(req, res) {
    try {
      const deleted = await activityRepository.remove(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
      }
      res.json({ message: 'Actividad eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar la actividad' });
    }
  },

  // GET /courses/:courseId/activities
  async getByCourse(req, res) {
    try {
      const activities = await activityRepository.findByCourse(req.params.courseId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener las actividades del curso' });
    }
  },


  // GET /courses/:teacherId/activities
  async getByTeacher(req, res) {
    try {
        const activities = await activityRepository.findByTeacher(req.params.teacherId);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las actividades del profesor' })
    }
  }

};

export default activityController;
