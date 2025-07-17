import * as CourseService from './course.service.js';

class CourseController {
  async create(req, res) {
    try {
      const course = await CourseService.createCourse(req.body);
      return res.status(201).json({
        success: true,
        message: 'Curso creado correctamente',
        data: course,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al crear el curso',
        error: error.message,
      });
    }
  }

  async findAll(req, res) {
    try {
      const courses = await CourseService.getAllCourses();
      return res.status(200).json({
        success: true,
        data: courses,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener los cursos',
        error: error.message,
      });
    }
  }

  async findById(req, res) {
    try {
      const course = await CourseService.getCourseById(req.params.id);
      return res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener el curso',
        error: error.message,
      });
    }
  }

  async update(req, res) {
    try {
      const updated = await CourseService.updateCourse(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Curso actualizado correctamente',
        data: updated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al actualizar el curso',
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      await CourseService.deleteCourse(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Curso eliminado correctamente',
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al eliminar el curso',
        error: error.message,
      });
    }
  }

  async findActive(req, res) {
    try {
      const activeCourses = await CourseService.findActiveCourses();
      return res.status(200).json({
        success: true,
        data: activeCourses,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error interno al obtener los cursos activos',
        error: error.message,
      });
    }
  }
}

export default new CourseController();
