import TeacherCourse from './teacher.course.model.js';
import Teacher from '../teacher/teacher.model.js';
import Course from '../course/course.model.js';

class TeacherCourseRepository {
  async create({ id_teacher, id_course }) {
    return await TeacherCourse.create({ id_teacher, id_course });
  }

  async findAll() {
    return await TeacherCourse.findAll();
  }

  async findByTeacherId(id_teacher) {
  return await TeacherCourse.findAll({
    where: { id_teacher },
    include: [
      {
        model: Course,
        as: 'course', // debe coincidir con el alias usado en belongsTo
        attributes: ['id_course', 'course', 'year', 'status', 'description']
      }
    ]
  });
}


  async findByCourseId(id_course) {
  return await TeacherCourse.findAll({
    where: { id_course },
    include: [{
      model: Teacher,
      attributes: ['id_teacher', 'id_user', 'name', 'lastname', 'phone_number', 'observations'],
    }]
  });
}

  async deleteByIds(id_teacher, id_course) {
    return await TeacherCourse.destroy({
      where: { id_teacher, id_course }
    });
  }

  async exists(id_teacher, id_course) {
    const record = await TeacherCourse.findOne({
      where: { id_teacher, id_course }
    });
    return !!record;
  }
}

export default new TeacherCourseRepository();
