import bcrypt from 'bcryptjs/dist/bcrypt.js';
import Teacher from '../models/teacher.model.js';
import User from '../models/user.model.js'; // Import the User model
import Role from '../models/role.model.js';
import sequelize from '../config/sequalize.js';
import Course from '../models/Course.js';
import TeacherCourse from '../models/teacher.course.model.js';
import Company from '../models/company.model.js'; // Added
import Group from '../models/group.model.js'; // Added
import { AppError, NotFoundError } from '../utils/errorHandler.js';
import { Op } from 'sequelize';

class TeacherService {
    static async getTeacherCourses(userId) {
        try {
            const teacher = await Teacher.findOne({ where: { id_user: userId } });
            if (!teacher) {
                throw new NotFoundError('Teacher');
            }

            const courses = await Course.findAll({
                include: {
                    model: Teacher,
                    through: TeacherCourse,
                    as: 'teachers',
                    where: { id_teacher: teacher.id_teacher },
                    attributes: [] // We don't need teacher attributes here, just to filter
                },
                attributes: ['id_course', 'course']
            });

            return courses;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError('Error al obtener los cursos del profesor', 500);
        }
    }

    static async getTeacherGroups(userId) {
        try {
            const teacher = await Teacher.findOne({ where: { id_user: userId } });
            if (!teacher) {
                throw new NotFoundError('Teacher');
            }

            // Get all courses associated with this teacher
            const teacherCourses = await TeacherCourse.findAll({
                where: { id_teacher: teacher.id_teacher },
                attributes: ['id_course']
            });

            const courseIds = teacherCourses.map(tc => tc.id_course);

            if (courseIds.length === 0) {
                return []; // No courses assigned to this teacher, so no groups
            }

            // Find all groups belonging to these courses
            const groups = await Group.findAll({
                where: {
                    id_course: {
                        [Op.in]: courseIds
                    }
                },
                include: [
                    { model: Course, attributes: ['course'] },
                    { model: Company, attributes: ['name'] }
                ]
            });

            return groups;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError(`Error al obtener los grupos del profesor: ${error.message}`, 500);
        }
    }

    static async createTeacher(teacherData) {
        try {
            const teacher = await Teacher.create(teacherData);
            return teacher;
        } catch (error) {
            throw new AppError('Error creating teacher', 500);
        }
    }

    static async createTeacherWithUser(teacherData) {
        const t = await sequelize.transaction();
        try {
            const { email, password, name, lastname, dni, phone_number, observations } = teacherData;
            const finalPassword = password || dni;

            const teacherRole = await Role.findOne({ where: { name: 'Profesor' } }, { transaction: t });
            if (!teacherRole) {
                throw new AppError("The 'Profesor' role is not configured in the system.", 500);
            }

            const hashedPassword = await bcrypt.hash(finalPassword, 10);
            
            /** Primero creamos el usuario */
            const newUser = await User.create({
                email,
                password: hashedPassword,
                name,
                lastname,
                dni,
                phone_number,
                id_role: teacherRole.id_role
            }, { transaction: t });     
        

            /** con el usuario creado agregamos profesor */
            const newTeacher = await Teacher.create({
                id_user: newUser.id_user,
                name,
                lastname,
                phone_number,
                observations
            }, { transaction: t });

            await t.commit();
            return newTeacher;
        } catch (error) {
            await t.rollback();
            if (error.name === 'SequelizeUniqueConstraintError') {
                throw new AppError('Email or DNI already registered.', 409);
            }
            console.error("Error in createTeacherWithUser:", error);
            throw new AppError('Internal server error while creating the teacher.', 500);
        }
      
    }

    static async getAllTeachers() {
        try {
            const teachers = await Teacher.findAll({
                include: [{
                    model: User,
                    attributes: ['email'] // Include the email from the User model
                }]
            });
            return teachers;
        } catch (error) {
            throw new AppError('Error getting teachers', 500);
        }
    }

    static async getTeacherById(id) {
        const teacher = await Teacher.getById(id);
        if (!teacher) {
            throw new NotFoundError('Teacher');
        }
        return teacher;
    }

    static async restoreTeacher(id) {
        try {
            await Teacher.restore(id);
        } catch (error) {
            throw new AppError('Error restoring teacher', 500);
        }
    }

    static async softDeleteTeacher(id_user) {
        const t = await sequelize.transaction();
        try {
            const teacher = await Teacher.findOne({ where: { id_user: id_user } }, { transaction: t });
            if (!teacher) {
                throw new NotFoundError('Teacher not found');
            }

            await User.update({ is_deleted: true, deleted_at: new Date() }, { where: { id_user: id_user }, transaction: t });
            await Teacher.update({ is_deleted: true }, { where: { id_teacher: teacher.id_teacher }, transaction: t });

            await t.commit();
        } catch (error) {
            await t.rollback();
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError('Error performing soft delete on teacher', 500);
        }
    }

    static async updateTeacher(id_teacher, teacherData) {
        const t = await sequelize.transaction();
        try {
            const { name, lastname, phone_number, observations, email } = teacherData;

            const teacher = await Teacher.findByPk(id_teacher, { transaction: t });
            if (!teacher) {
                throw new NotFoundError('Teacher not found');
            }

            // Update teacher fields
            if (name) teacher.name = name;
            if (lastname) teacher.lastname = lastname;
            if (phone_number) teacher.phone_number = phone_number;
            if (observations) teacher.observations = observations;

            await teacher.save({ transaction: t });

            // Update user fields if necessary
            if (email) {
                const user = await User.findByPk(teacher.id_user, { transaction: t });
                if (user) {
                    // Normalize emails for comparison (trim whitespace and convert to lowercase)
                    const currentEmailNormalized = user.email.trim().toLowerCase();
                    const newEmailNormalized = email.trim().toLowerCase();

                    if (currentEmailNormalized !== newEmailNormalized) {
                        // Only perform uniqueness check if email is actually changing
                        const existingUser = await User.findOne({
                            where: {
                                email: newEmailNormalized, // Search for the normalized email
                                id_user: { [Op.ne]: user.id_user }
                            },
                            transaction: t
                        });

                        if (existingUser) {
                            throw new AppError('Email already registered.', 409);
                        }
                        user.email = email; // Store the original (non-normalized) email
                        await user.save({ transaction: t });
                    }
                }
            }

            await t.commit();
            return teacher;
        } catch (error) {
            await t.rollback();
            if (error instanceof NotFoundError || error instanceof AppError) {
                throw error;
            }
            throw new AppError('Error updating teacher', 500);
        }
    }
}

export default TeacherService;
