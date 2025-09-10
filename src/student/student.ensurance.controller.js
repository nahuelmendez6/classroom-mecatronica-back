import StudentEnsuranceRepository from './student.ensurance.repository.js';

const StudentEnsuranceController = {
  // Crear un nuevo seguro de estudiante
  async create(req, res) {
    try {
      const data = req.body;
    
      if (req.file) data.document_url = req.file.path;

      // asignar año 
      if (!data.year) data.year = new Date().getFullYear();

      // Verificar si ya existe un seguro para el estudiante en el mismo año
      const existingRecord = await StudentEnsuranceRepository.findByStudentAndYear(data.id_student, data.year);
      if (existingRecord) {
        return res.status(400).json({ message: 'Ya existe un seguro para este estudiante en el año especificado' });
      }

      // Crear el nuevo registro    


      const newRecord = await StudentEnsuranceRepository.create(data);
      res.status(201).json(newRecord);
    } catch (error) {
        console.error("Error al crear seguro de estudiante: ", error);
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener todos los seguros
  async getAll(req, res) {
    try {
      const records = await StudentEnsuranceRepository.findAll();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener un seguro por ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const record = await StudentEnsuranceRepository.findById(id);
      if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
      res.json(record);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Obtener por estudiante y año
  async getByStudentAndYear(req, res) {
    try {
        const { id_student, year } = req.params;
        const record = await StudentEnsuranceRepository.findByStudentAndYear(id_student, year);
        if (!record) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(record);   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  },

  // Actualizar un seguro por ID
  async update(req, res) {
    try {
        const { id } = req.params;
        const data = req.body;

        if (req.file) {
        data.document_url = req.file.path;
        }

        const updatedRecord = await StudentEnsuranceRepository.update(id, data);
        if (!updatedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json(updatedRecord);
    } catch (error) {
        console.error(error); // imprime el error completo en consola
        res.status(500).json({ error: error.message });
    }
  },


  // Eliminar un seguro por ID
    remove: async (req, res) => {
        try {
        const { id } = req.params;
        const deletedRecord = await StudentEnsuranceRepository.delete(id);
        if (!deletedRecord) return res.status(404).json({ message: 'Registro no encontrado' });
        res.json({ message: 'Registro eliminado correctamente' });
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
        }
    }
};

export default StudentEnsuranceController;
