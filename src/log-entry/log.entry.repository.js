import LogEntry from './log.entry.model.js';

const LogEntryRepository = {
  async create(data, options) {
    return await LogEntry.create(data, options);
  },

  async findAll(filters = {}) {
    return await LogEntry.findAll({
      where: { ...filters, is_deleted: false },
      order: [['entry_date', 'DESC']],
    });
  },

  async findById(id_log_entry) {
    return await LogEntry.findOne({
      where: { id_log_entry, is_deleted: false },
    });
  },

  async update(id_log_entry, data) {
    return await LogEntry.update(data, {
      where: { id_log_entry, is_deleted: false },
    });
  },

  async softDelete(id_log_entry) {
    return await LogEntry.update(
      { is_deleted: true, deleted_at: new Date() },
      { where: { id_log_entry } }
    );
  },

  async findByStudent(id_student) {
    return await LogEntry.findAll({
      where: { id_student, is_deleted: false },
      order: [['entry_date', 'DESC']],
    });
  },

  async findByModule(id_module) {
    return await LogEntry.findAll({
      where: { id_module, is_deleted: false },
      order: [['entry_date', 'DESC']],
    });
  }
};

export default LogEntryRepository;
