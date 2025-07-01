import Course from '../models/Course.js';
import Module from '../models/module.model.js';
import StudentCourse from '../models/student.course.js';
import Student from '../models/student.model.js';

export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [
        {
          model: Module,
          as: 'modulos'
        }
      ]
    });
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error in getAllCourses:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener los cursos'
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.getById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error in getCourseById:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al obtener el curso'
    });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { course, start_date, end_date, status, description } = req.body;

    // Validaciones básicas
    if (!course || !start_date || !end_date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // Validar fechas
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de finalización'
      });
    }

    const newCourse = await Course.create({
      course,
      start_date,
      end_date,
      status,
      description
    });

    res.status(201).json({
      success: true,
      data: newCourse
    });
  } catch (error) {
    console.error('Error in createCourse:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al crear el curso'
    });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const { course, start_date, end_date, status, description } = req.body;

    // Validaciones básicas
    if (!course || !start_date || !end_date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos'
      });
    }

    // Validar fechas
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de inicio debe ser anterior a la fecha de finalización'
      });
    }

    const updatedCourse = await Course.update(req.params.id, {
      course,
      start_date,
      end_date,
      status,
      description
    });

    res.json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    console.error('Error in updateCourse:', error);
    if (error.message === 'Curso no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error al actualizar el curso'
    });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    await Course.delete(req.params.id);
    res.json({
      success: true,
      message: 'Curso eliminado correctamente'
    });
  } catch (error) {
    console.error('Error in deleteCourse:', error);
    if (error.message === 'Curso no encontrado') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    if (error.message.includes('módulos asociados')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message || 'Error al eliminar el curso'
    });
  }

};

export const enrollStudent = async (req, res) => {

  try {

    const { courseId, studentId } = req.body;

    if (!courseId || !studentId) {

      return res.status(400).json({
        success: false,
        message: 'Faltan datos: courseId y studentId son requeridos'
      });
    }

    const result = await Course.enrollStudent(courseId, studentId);

    res.json({
      success: true,
      message: 'Estudiante inscrito correctamente',
      data:result
    });
  } catch (error) {
    console.error('Error in enrollStudent:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al inscribir al estudiante'
    });
  }
}

export const getStudentsByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByPk(courseId, {
      include: {
        model: Student,
        through: {
          model: StudentCourse,
          attributes: ['enrollment_date', 'status'] // Campos de la tabla intermedia
        }
      }
    });

    if (!course) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }

    const studentsWithEnrollment = course.Students.map(student => {
      return {
        id_student: student.id_student,
        name: student.name,
        lastname: student.lastname,
        dni: student.dni,
        enrollment_date: student.StudentCourse.enrollment_date,
        status: student.StudentCourse.status
      };
    });

    res.json(studentsWithEnrollment);
  } catch (error) {
    console.error('Error al obtener estudiantes del curso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};