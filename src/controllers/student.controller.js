import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import sequelize from '../config/sequalize.js';
import User from '../models/user.model.js'; // Asumo que este modelo existe
import Student from '../models/student.model.js';
import StudentCourse from '../models/student.course.js';
import Role from '../models/role.model.js'; // Asumo que este modelo existe


export const createStudentWithUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        email,
        password,
        name,
        lastname,
        dni,
        phone_number,
        observations,
        id_course
    } = req.body;

    const t = await sequelize.transaction();

    try {
        // 1. Buscar el rol de "Estudiante". Es más robusto que usar un ID hardcodeado.
        const studentRole = await Role.findOne({ where: { name: 'Estudiante' } }, { transaction: t });
        if (!studentRole) {
            await t.rollback();
            return res.status(500).json({ message: "El rol 'Estudiante' no se encuentra configurado en el sistema." });
        }

        // 2. Crear el nuevo usuario
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            name,
            lastname,
            dni,
            phone_number,
            id_role: studentRole.id_role // Usar el ID del rol encontrado
        }, { transaction: t });

        // 3. Crear el estudiante asociado al usuario
        const newStudent = await Student.create({
            id_user: newUser.id_user,
            name,
            lastname,
            dni,
            phone_number,
            observations
        }, { transaction: t });

        // 4. Asignar el estudiante al curso
        await StudentCourse.create({
            id_student: newStudent.id_student,
            id_course: id_course
        }, { transaction: t });

        // Si todo fue bien, confirmamos la transacción
        await t.commit();

        res.status(201).json({
            success: true,
            message: 'Estudiante creado y asignado al curso exitosamente.',
            student: newStudent
        });

    } catch (error) {
        // Si algo falla, revertimos todos los cambios
        await t.rollback();
        console.error('Error al crear estudiante con usuario:', error);

        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({ message: 'El email o DNI ya está registrado.' });
        }

        res.status(500).json({ message: 'Error interno del servidor al crear el estudiante.' });
    }
};

/**
 * Crea un nuevo usuario estudiante y lo asigna a un curso
 * @param {Object} req - Request object 
 * @param {Object} res - Response object 
 */

export const createStudentUser = async (req, res) => {
    try {
        console.log('Iniciando creación de estudiante con datos: ',  { ...req.body, password: '[REDACTED]' })

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success:false,
                message: 'Error de validación',
                errors: errors.array()
            })
        }

        const {
            email,
            dni,
            name,
            lastname,
            phone_number,
            observations,
            id_course
          } = req.body;

        if (!email || !dni || !name || !lastname || !id_course) {
            return res.status(400).json({
              success: false,
              message: 'Faltan campos obligatorios'
            });
        }

        // Verificar email duplicado
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
            success: false,
            message: 'El email ya está registrado'
            });
        }

        // Verificar DNI duplicado en estudiantes
        const existingStudent = await Student.findOne({ where: { dni } });
        if (existingStudent) {
            return res.status(400).json({
            success: false,
            message: 'El DNI ya está registrado como estudiante'
            });
        }

        // Hashear el DNI como contraseña inicial
        const hashedPassword = await bcrypt.hash(dni.toString(), 10);
        
        // Crear usuario (suponiendo que id_role 3 = estudiante)
        const newUser = await User.create({
            email,
            password: hashedPassword,
            id_role: 3,
            name,
            lastname,
            dni,
            phone_number,
            id_module: null,
            observations,
            id_company: null,
            phone: phone_number,
            position: null
        });

        // Crear estudiante
        const newStudent = await Student.create({
            id_user: newUser.id_user,
            name,
            lastname,
            dni,
            phone_number,
            observations
        });

        // Asignar estudiante a curso
        await StudentCourse.create({
            id_student: newStudent.id_student,
            id_course
        });

        return res.status(201).json({
            success: true,
            message: 'Estudiante creado y asignado correctamente',
            data: {
              id_user: newUser.id_user,
              id_student: newStudent.id_student
            }
          });

    } catch (error) {
        console.error('Error al crear estudiante:', error);
        return res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: error.message
        });
      }
}



export const getAllStudents = async (req, res) => {
    try {
      const students = await Student.findAll();
      res.status(200).json(students);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      res.status(500).json({ message: 'Error al obtener los estudiantes.' });
    }
  };