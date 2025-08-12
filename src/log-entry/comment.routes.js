import express from 'express';
import CommentController from './comment.controller.js';

const router = express.Router();

router.post('/', CommentController.create);
router.get('/log-entry/:id_log_entry', CommentController.findByLogEntry);
router.put('/:id_comment', CommentController.update);
router.delete('/:id_comment', CommentController.softDelete);

export default router;
