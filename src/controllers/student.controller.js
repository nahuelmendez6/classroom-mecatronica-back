import Student from '../models/student.model.js';
import { validationResult } from 'express-validator';

class StudentController {
    static async create(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const student = await Student.create(req.body);
            res.status(201).json(student);
        } catch (error) {
            res.status(500).json({ message: 'Error creating student', error: error.message });
        }
    }

    static async delete(req, res) {
        try {
            const success = await Student.delete(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Student not found or already deleted' });
            }
            res.json({ message: 'Student deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting student', error: error.message });
        }
    }

    static async restore(req, res) {
        try {
            const success = await Student.restore(req.params.id);
            if (!success) {
                return res.status(404).json({ message: 'Student not found or not deleted' });
            }
            res.json({ message: 'Student restored successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error restoring student', error: error.message });
        }
    }

    static async getAll(req, res) {
        try {
            const students = await Student.getAll();
            res.json(students);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching students', error: error.message });
        }
    }

    static async getById(req, res) {
        try {
            const student = await Student.getById(req.params.id);
            if (!student) {
                return res.status(404).json({ message: 'Student not found' });
            }
            res.json(student);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching student', error: error.message });
        }
    }
}

export default StudentController;
