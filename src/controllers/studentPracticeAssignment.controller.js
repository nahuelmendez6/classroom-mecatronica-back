import StudentPracticeAssignment from '../models/student.practice.assignment.model.js';
import Student from '../models/student.model.js';
import Company from '../models/company.model.js';
import Module from '../models/module.model.js';

// Crear una asignación de práctica
export const createAssignment = async (req, res) => {
    try {
        const assignment = await StudentPracticeAssignment.create(req.body);
        res.status(201).json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la asignación de práctica' });
    }
};

// Obtener todas las asignaciones
export const getAllAssignments = async (req, res) => {
    try {
        const assignments = await StudentPracticeAssignment.findAll({
            include: [
                {
                    model:Student,
                    include: [User]
                },
                Company,
                Module
            ]
        });
        res.json(assignments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las asignaciones' });
    }
};

// Obtener asignación por ID
export const getAssignmentById = async (req, res) => {
    try {
        const assignment = await StudentPracticeAssignment.findByPk(req.params.id, {
            include: [Student, Company, Module]
        });

        if (!assignment) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        res.json(assignment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la asignación' });
    }
};

// Actualizar asignación por ID
export const updateAssignment = async (req, res) => {
    try {
        const updated = await StudentPracticeAssignment.update(req.body, {
            where: { id_assignment: req.params.id }
        });

        if (updated[0] === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada o sin cambios' });
        }

        res.json({ message: 'Asignación actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la asignación' });
    }
};

// Eliminar asignación por ID
export const deleteAssignment = async (req, res) => {
    try {
        const deleted = await StudentPracticeAssignment.destroy({
            where: { id_assignment: req.params.id }
        });

        if (deleted === 0) {
            return res.status(404).json({ message: 'Asignación no encontrada' });
        }

        res.json({ message: 'Asignación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la asignación' });
    }
};
