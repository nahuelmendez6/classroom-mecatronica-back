import ActivityResponseRepository from './activity.response.repository.js';
import ActivityResponseAttachmentRepository from './activity.response.attachment.repository.js';
import ActivityResponse from './activity.response.model.js';

const ActivityResponseController = {
  /**
   * Crear una nueva respuesta de actividad
   */
  
  async createWithFiles(req, res) {
    try {
      const data = req.body;
      const files = req.files;

      const newResponse = await ActivityResponseRepository.create(data);

      if (files && files.length > 0) {
        await ActivityResponseAttachmentRepository.createMany(files, newResponse.id_response);
      }

      res.status(201).json({ message: 'Respuesta creada con archivos adjuntos.', response: newResponse });
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      res.status(500).json({ message: 'Error al crear la respuesta.' });
    }
  },
  
  
  
  
  
  async create(req, res) {
    try {
      const data = req.body;
      const newResponse = await ActivityResponseRepository.create(data);
      res.status(201).json(newResponse);
    } catch (error) {
      console.error('Error al crear la respuesta:', error);
      res.status(500).json({ message: 'Error al crear la respuesta.' });
    }
  },


  /**
   * Obtener todas las respuestas de una actividad especifica con sus adjuntos
   */
  async getByActivityId(req, res) {
    const { id_activity } = req.params;

    try {
      const responses = await ActivityResponseRepository.findByActivity(id_activity);
      return res.status(200).json(responses);
    } catch (error) {
      console.error('Error al obtener respuestas por actividad: ', error);
      return res.status(500).json({ error: 'error interno del servidor '});
    }
  },


  /**
   * Obtener respuesta por ID
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const response = await ActivityResponseRepository.findById(id);
      if (!response) {
        return res.status(404).json({ message: 'Respuesta no encontrada.' });
      }
      res.json(response);
    } catch (error) {
      console.error('Error al obtener la respuesta:', error);
      res.status(500).json({ message: 'Error al obtener la respuesta.' });
    }
  },

  /**
   * Obtener respuestas por estudiante
   */
  async getByStudent(req, res) {
    try {
      const { id_student } = req.params;
      const responses = await ActivityResponseRepository.findByStudent(id_student);
      res.json(responses);
    } catch (error) {
      console.error('Error al obtener respuestas del estudiante:', error);
      res.status(500).json({ message: 'Error al obtener respuestas del estudiante.' });
    }
  },

  /**
   * Obtener respuestas por actividad
   */
  async getByActivity(req, res) {
    try {
      const { id_activity } = req.params;
      const responses = await ActivityResponseRepository.findByActivity(id_activity);
      res.json(responses);
    } catch (error) {
      console.error('Error al obtener respuestas de la actividad:', error);
      res.status(500).json({ message: 'Error al obtener respuestas de la actividad.' });
    }
  },

  /**
   * Actualizar una respuesta
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const [updatedRows] = await ActivityResponseRepository.update(id, updates);
      if (updatedRows === 0) {
        return res.status(404).json({ message: 'Respuesta no encontrada o sin cambios.' });
      }
      res.json({ message: 'Respuesta actualizada correctamente.' });
    } catch (error) {
      console.error('Error al actualizar la respuesta:', error);
      res.status(500).json({ message: 'Error al actualizar la respuesta.' });
    }
  },

  /**
   * Eliminar una respuesta
   */
  async remove(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ActivityResponseRepository.delete(id);
      if (deleted === 0) {
        return res.status(404).json({ message: 'Respuesta no encontrada.' });
      }
      res.json({ message: 'Respuesta eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar la respuesta:', error);
      res.status(500).json({ message: 'Error al eliminar la respuesta.' });
    }
  }
};

export default ActivityResponseController;
