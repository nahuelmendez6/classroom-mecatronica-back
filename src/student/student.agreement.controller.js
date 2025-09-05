import StudentAgreementRepository from "./student.agreement.repository.js";

class StudentAgreementController {

    // crear un acuerdo
    async create(req, res) {
        try {
            const data = req.body;
            if (req.file) data.document_url = req.file.path;


            // asignar año 
            if (!data.year) data.year = new Date().getFullYear();

            const agreement = await StudentAgreementRepository.create(data);
            res.status(201).json({success: true, data: agreement});
        } catch (error) {
            console.error("Error al cargar convenio de alumno: ", error);
            res.status(500).json({ success: false, message: "Error interno del servidor"});
        }
    }

    // Listar todos los convenios
    async findAll(req, res) {
        try {
            const agreement = await StudentAgreementRepository.findAll();
            res.json({ success: true, data: agreement });
        } catch (error) {
            console.log("Error al obtener StudentAgreements: ", error);
            res.status(500).json({ success: false, message: "Error interno del servidor "});
        }
    }

    // Buscar por ID
    async findById(req, res) {
        try {
            const { id } = req.params;
            const agreement = await StudentAgreementRepository.findById(id);
            if (!agreement) {
                return res.status(404).json({ success: false, message: "No encontrado"});
            }
            res.json( {success: true, data: agreement} );
        } catch (error) {
            console.error("Error al obtener StudentAgreement", error);
            res.status(500).json({success: false, message: "Error interno del servidor"});
        }
    }

    // Buscar por estudiante y año
    async findByStudentAndYear(req, res) {
        try {
            const { id_student, year } = req.query;
            const agreement = await StudentAgreementRepository.findByStudentAndYear(id_student, year);
            if (!agreement) {
                return res.status(404).json({ success: false, message: "No encontrado"});
            }
            res.json({ success: true, data: agreement});
        } catch (error) {
            console.error("Error al buscar StudentAgreement:", error);
            res.satus(500).json({ success:false, message: "Error interno del servidor"});
        }
    }


    // Actualizar
    async update(req, res) {
        try {
        const { id } = req.params;
        const data = req.body;
        const updated = await StudentAgreementRepository.update(id, data);
        if (!updated) {
            return res.status(404).json({ success: false, message: "No encontrado" });
        }
        res.json({ success: true, data: updated });
        } catch (error) {
        console.error("Error al actualizar StudentAgreement:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }

    // Eliminar
    async delete(req, res) {
        try {
        const { id } = req.params;
        const deleted = await StudentAgreementRepository.delete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "No encontrado" });
        }
        res.json({ success: true, message: "Eliminado correctamente" });
        } catch (error) {
        console.error("Error al eliminar StudentAgreement:", error);
        res.status(500).json({ success: false, message: "Error interno del servidor" });
        }
    }
}


export default new StudentAgreementController();