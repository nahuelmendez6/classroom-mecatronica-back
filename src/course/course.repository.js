import Course from './course.model.js';
// import Teacher from './teacher.model.js';
// import TeacherCourse from '../models/teacher.course.model.js';
// import Group from '../models/group.model.js';
// import Module from '../models/module.model.js';
import { Op } from 'sequelize';



/**
 * Crea un nuevo curso.
 */
export async function createCourse(courseData) {
  console.log("BODY de curso recibido: ", courseData)
  return await Course.create(courseData);
}


/**
 * Encuentra un curso por su ID.
 */
export async function findById(id_course) {
  return await Course.findByPk(id_course);
}

/**
 * Encuentra todos los cursos.
 */
export async function findAllCourses() {
  return await Course.findAll();
}


/**
 * Actualiza un curso existente.
 */
export async function updateCourse(id_course, updateData) {
  return await Course.update(updateData, {
    where: { id_course }
  });
}

/**
 * Elimina un curso por ID.
 */
export async function deleteCourse(id_course) {
  return await Course.destroy({
    where: { id_course }
  });
}



/**
 * Encuentra todos los cursos activos (por estado).
 */
export async function findActiveCourses() {
  return await Course.findAll({
    where: {
      status: 'activo'
    }
  });
}

/**
 * Encuentra cursos asignados a un docente.
 */
// export async function findCoursesByTeacher(teacherId) {
//   return await Course.findAll({
//     include: {
//       model: Teacher,
//       through: TeacherCourse,
//       as: 'teachers',
//       where: { id_teacher: teacherId },
//       attributes: []
//     },
//     attributes: ['id_course', 'course']
//   });
// }

/**
 * Encuentra módulos relacionados a los cursos dados.
 */
// export async function findModulesByCourses(coursesIds) {
//   return await Module.findAll({
//     where: {
//       id_course: {
//         [Op.in]: coursesIds
//       }
//     },
//     include: [
//       { model: Course, attributes: ['course'] }
//     ]
//   });
// }

/**
 * Encuentra grupos asignados a los cursos dados.
 */
// export async function findGroupsByCourses(coursesIds) {
//   return await Group.findAll({
//     where: {
//       id_course: {
//         [Op.in]: coursesIds
//       }
//     },
//     include: [
//       { model: Course, attributes: ['course'] }
//     ]
//   });
// }




