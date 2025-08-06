import Activity from './activity.model.js';

const activityRepository = {
  // Obtener todas las tareas
  async findAll() {
    return await Activity.findAll();
  },

  // Obtener una tarea por ID
  async findById(id) {
    return await Activity.findByPk(id);
  },

  // Crear una nueva tarea
  async create(data) {
    return await Activity.create(data);
  },

  // Actualizar una tarea existente
  async update(id, data) {
    const activity = await Activity.findByPk(id);
    if (!activity) return null;
    return await activity.update(data);
  },

  // Eliminar una tarea
  async remove(id) {
    const activity = await Activity.findByPk(id);
    if (!activity) return null;
    await activity.destroy();
    return activity;
  },

  // Buscar todas las tareas de un curso específico
  async findByCourse(courseId) {
    return await Activity.findAll({ where: { course_id: courseId } });
  },

  // Buscar tareas por profesor
  async findByTeacher(teacherId) {
    return await Activity.findAll({ where: { id_teacher: teacherId }});
  }
};

export default activityRepository;
