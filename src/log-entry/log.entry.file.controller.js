import LogEntry from './log.entry.model.js'
import LogEntryRepository from './log.entry.repository.js'
import LogEntryFile from './log.entry.file.js'

export const createLogEntryWithFiles = async (req, res) => {
    const t = await LogEntry.sequelize.transaction();
    try {
        const {
            id_student,
            id_module,
            content,
            observations,
            created_by
        } = req.body;

        const logEntry = await LogEntryRepository.create({
            id_student,
            id_module,
            content,
            observations,
            created_by
        }, { transaction: t });

        if (req.files && req.files.length > 0) {
            const filePromises = req.files.map(file => 
                LogEntryFile.create({
                    id_log_entry: logEntry.id_log_entry,
                    file_path: file.path,
                    original_name: file.originalname
                }, { transaction: t})
            );
            await Promise.all(filePromises);
        }

        await t.commit();
        res.status(201).json({ logEntry });
    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: 'Error al crear log entry', details: err.message});
    }
};

export const getFilesByLogEntry = async (req, res) => {
  const { id } = req.params;

  try {
    const files = await LogEntryFile.findAll({
      where: { id_log_entry: id },
      attributes: ['id_log_entry_file', 'original_name', 'file_path', 'uploaded_at']
    });

    // Agregamos URL pública a cada archivo
    const filesWithUrl = files.map(file => ({
      id: file.id_log_entry_file,
      name: file.original_name,
      uploaded_at: file.uploaded_at,
      url: `${process.env.BASE_URL || 'http://localhost:3000'}/${file.file_path.replace(/\\/g, '/')}`
    }));

    res.json(filesWithUrl);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener archivos', details: error.message });
  }
};
