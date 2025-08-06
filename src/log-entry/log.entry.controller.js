import LogEntryRepository from './log.entry.repository.js';

const LogEntryController = {
  async create(req, res) {
    try {
      const newEntry = await LogEntryRepository.create(req.body);
      return res.status(201).json(newEntry);
    } catch (error) {
      console.error('Error al crear log entry:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getAll(req, res) {
    try {
      const entries = await LogEntryRepository.findAll();
      return res.json(entries);
    } catch (error) {
      console.error('Error al obtener log entries:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const entry = await LogEntryRepository.findById(id);
      if (!entry) return res.status(404).json({ error: 'Entrada no encontrada' });
      return res.json(entry);
    } catch (error) {
      console.error('Error al obtener log entry:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await LogEntryRepository.update(id, req.body);
      return res.json({ message: 'Actualizado correctamente', result });
    } catch (error) {
      console.error('Error al actualizar log entry:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async softDelete(req, res) {
    try {
      const { id } = req.params;
      await LogEntryRepository.softDelete(id);
      return res.json({ message: 'Eliminado lógicamente' });
    } catch (error) {
      console.error('Error al eliminar log entry:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getByStudent(req, res) {
    try {
      const { id_student } = req.params;
      const entries = await LogEntryRepository.findByStudent(id_student);
      return res.json(entries);
    } catch (error) {
      console.error('Error al obtener entradas por estudiante:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async getByModule(req, res) {
    try {
      const { id_module } = req.params;
      const entries = await LogEntryRepository.findByModule(id_module);
      return res.json(entries);
    } catch (error) {
      console.error('Error al obtener entradas por módulo:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

export default LogEntryController;
