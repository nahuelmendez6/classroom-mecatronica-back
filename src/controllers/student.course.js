import StudentCourse from "../models/student.course.js"


export const assignStudentToCourse = async (req, res) => {
    const { id_student, id_course } = req.body;

    try {
        const assignment = await StudentCourse.create({ id_student, id_course});
        res.json({ success: true, data: assignment});
    } catch (errpr) {
        console.error(error);
        res.status(400).json({ success: false, message: 'Error al asignar alumno al curso'});
    }
};