import Comment from "./comment.model.js";

const CommentRepository = {
    async create(data, options) {
        return await Comment.create(data, options);
    },

    async findCommentByLogEntry(id_log_entry) {
        return await Comment.findAll({
            where: { id_log_entry, is_deleted: false },
            order: [['created_at', 'DESC']],
        });
    },

    async findById(id_comment) {
        return await Comment.findOne({
            where: { id_comment, is_deleted: false },
        });
    },

    async update(id_comment, data, options) {
        const comment = await this.findById(id_comment);
        if (!comment) return null;
        return await comment.update(data, options);
    },

    async softDelete(id_comment) {
        const comment = await this.findById(id_comment);
        if (!comment) return null;
        return await comment.update({ is_deleted: true, deleted_at: new Date() });
    }

}

export default CommentRepository;