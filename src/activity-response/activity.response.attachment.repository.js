import ActivityResponseAttachment from './activity.response.attachment.js';

const ActivityResponseAttachmentRepository = {
  async createMany(files, id_response) {
    const records = files.map(file => ({
      id_response,
      file_path: file.path
    }));
    return await ActivityResponseAttachment.bulkCreate(records);
  }
};

export default ActivityResponseAttachmentRepository;
