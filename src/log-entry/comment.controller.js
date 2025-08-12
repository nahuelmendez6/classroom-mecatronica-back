import CommentRepository from './comment.repository.js';

const CommentController = {

  async create(req, res) {
    try {
      const data = req.body;
      const comment = await CommentRepository.create(data);
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear comentario' });
    }
  },

  async findByLogEntry(req, res) {
    try {
      const { id_log_entry } = req.params;
      const comments = await CommentRepository.findCommentByLogEntry(id_log_entry);
      res.json(comments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener comentarios' });
    }
  },

  async update(req, res) {
    try {
      const { id_comment } = req.params;
      const data = req.body;
      const updatedComment = await CommentRepository.update(id_comment, data);
      if (!updatedComment) return res.status(404).json({ message: 'Comentario no encontrado' });
      res.json(updatedComment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar comentario' });
    }
  },

  async softDelete(req, res) {
    try {
      const { id_comment } = req.params;
      const deletedComment = await CommentRepository.softDelete(id_comment);
      if (!deletedComment) return res.status(404).json({ message: 'Comentario no encontrado' });
      res.json({ message: 'Comentario eliminado correctamente' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar comentario' });
    }
  },

};

export default CommentController;
