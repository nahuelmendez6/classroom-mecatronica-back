import Group from '../models/group.model.js';
import GroupStudent from '../models/group.student.model.js';
import Course from '../models/Course.js';
import Company from '../models/company.model.js';
import Student from '../models/student.model.js';
import sequelize from '../config/sequalize.js';
import { AppError, NotFoundError } from '../utils/errorHandler.js';

class GroupService {
    static async createGroup(groupData) {
        const t = await sequelize.transaction();
        try {
            const { group_name, id_course, id_company, student_ids } = groupData;

            const newGroup = await Group.create({
                group_name,
                id_course,
                id_company
            }, { transaction: t });

            if (student_ids && student_ids.length > 0) {
                const groupStudents = student_ids.map(studentId => ({
                    id_group: newGroup.id_group,
                    id_student: studentId
                }));
                await GroupStudent.bulkCreate(groupStudents, { transaction: t });
            }

            await t.commit();
            return newGroup;
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error al crear el grupo: ${error.message}`, 500);
        }
    }

    static async getAllGroups() {
        try {
            const groups = await Group.findAll({
                include: [
                    { model: Course, attributes: ['course'] },
                    { model: Company, attributes: ['company_name'] },
                    {
                        model: Student,
                        through: { attributes: [] }, // Exclude join table attributes
                        as: 'Students',
                        attributes: ['id_student', 'name', 'lastname']
                    }
                ]
            });
            return groups;
        } catch (error) {
            throw new AppError(`Error al obtener los grupos: ${error.message}`, 500);
        }
    }

    static async getGroupById(id) {
        const group = await Group.findByPk(id, {
            include: [
                { model: Course, attributes: ['course'] },
                { model: Company, attributes: ['company_name'] },
                {
                    model: Student,
                    through: { attributes: [] },
                    as: 'Students',
                    attributes: ['id_student', 'name', 'lastname']
                }
            ]
        });
        if (!group) {
            throw new NotFoundError('Grupo');
        }
        return group;
    }

    static async updateGroup(id, groupData) {
        const t = await sequelize.transaction();
        try {
            const { group_name, id_course, id_company, student_ids } = groupData;

            const group = await Group.findByPk(id, { transaction: t });
            if (!group) {
                throw new NotFoundError('Grupo');
            }

            await group.update({
                group_name,
                id_course,
                id_company
            }, { transaction: t });

            if (student_ids !== undefined) { // If student_ids is provided, update associations
                await GroupStudent.destroy({ where: { id_group: id }, transaction: t });
                if (student_ids.length > 0) {
                    const groupStudents = student_ids.map(studentId => ({
                        id_group: id,
                        id_student: studentId
                    }));
                    await GroupStudent.bulkCreate(groupStudents, { transaction: t });
                }
            }

            await t.commit();
            return group;
        } catch (error) {
            await t.rollback();
            throw new AppError(`Error al actualizar el grupo: ${error.message}`, 500);
        }
    }

    static async deleteGroup(id) {
        try {
            const group = await Group.findByPk(id);
            if (!group) {
                throw new NotFoundError('Grupo');
            }
            await group.destroy();
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError(`Error al eliminar el grupo: ${error.message}`, 500);
        }
    }

    static async addStudentToGroup(groupId, studentId) {
        try {
            const group = await Group.findByPk(groupId);
            if (!group) {
                throw new NotFoundError('Grupo');
            }
            const student = await Student.findByPk(studentId);
            if (!student) {
                throw new NotFoundError('Estudiante');
            }

            const existing = await GroupStudent.findOne({ where: { id_group: groupId, id_student: studentId } });
            if (existing) {
                throw new AppError('El estudiante ya está en este grupo', 409);
            }

            await GroupStudent.create({ id_group: groupId, id_student: studentId });
            return { message: 'Estudiante añadido al grupo correctamente' };
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof AppError) {
                throw error;
            }
            throw new AppError(`Error al añadir estudiante al grupo: ${error.message}`, 500);
        }
    }

    static async removeStudentFromGroup(groupId, studentId) {
        try {
            const result = await GroupStudent.destroy({ where: { id_group: groupId, id_student: studentId } });
            if (result === 0) {
                throw new NotFoundError('Asociación estudiante-grupo');
            }
            return { message: 'Estudiante eliminado del grupo correctamente' };
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError(`Error al eliminar estudiante del grupo: ${error.message}`, 500);
        }
    }

    static async getStudentsInGroup(groupId) {
        try {
            const group = await Group.findByPk(groupId, {
                include: {
                    model: Student,
                    through: { attributes: [] },
                    as: 'Students',
                    attributes: ['id_student', 'name', 'lastname', 'dni', 'phone_number']
                }
            });
            if (!group) {
                throw new NotFoundError('Grupo');
            }
            return group.Students;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            throw new AppError(`Error al obtener estudiantes del grupo: ${error.message}`, 500);
        }
    }
}

export default GroupService;