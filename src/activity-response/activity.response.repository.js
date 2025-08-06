import ActivityResponse from './activity.response.model.js';
import ActivityResponseAttachment from './activity.response.attachment.js';

const ActivityResponseRepository = {
  /**
   * Crea una nueva respuesta a una actividad
   * @param {Object} data - Datos de la respuesta
   * @returns {Promise<ActivityResponse>}
   */
  async create(data) {
    return await ActivityResponse.create(data);
  },

  async findAll() {
    return await ActivityResponse.findAll();
  },

  /**
   * Obtiene una respuesta por su ID
   * @param {number} id_response
   * @returns {Promise<ActivityResponse|null>}
   */
  async findById(id_response) {
    return await ActivityResponse.findByPk(id_response);
  },

  /**
   * Busca todas las respuestas de un estudiante
   * @param {number} id_student
   * @returns {Promise<ActivityResponse[]>}
   */
  async findByStudent(id_student) {
    return await ActivityResponse.findAll({
      where: { id_student }
    });
  },

  /**
   * Busca todas las respuestas a una actividad
   * @param {number} id_activity
   * @returns {Promise<ActivityResponse[]>}
   */
  async findByActivity(activityId) {
    return await ActivityResponse.findAll({
      where: { id_activity: activityId},
      include: [
        {
          model: ActivityResponseAttachment,
          as: 'attachments',
          attributes: ['id_attachment', 'file_path']
        }
      ]
    })
  },

  /**
   * Actualiza una respuesta
   * @param {number} id_response
   * @param {Object} updates - Campos a actualizar
   * @returns {Promise<[number]>} - [número de filas afectadas]
   */
  async update(id_response, updates) {
    return await ActivityResponse.update(updates, {
      where: { id_response }
    });
  },

  /**
   * Elimina una respuesta
   * @param {number} id_response
   * @returns {Promise<number>} - número de filas eliminadas
   */
  async delete(id_response) {
    return await ActivityResponse.destroy({
      where: { id_response }
    });
  }
};

export default ActivityResponseRepository;
