import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Detectar el endpoint o tipo de recurso desde req.route o req.baseUrl
    let folder = 'uploads/default';

    if (req.baseUrl.includes('log-entry')) {
      folder = 'uploads/log_entries';
    } else if (req.baseUrl.includes('activity-responses')) {
      folder = 'uploads/activity_responses';
    } else if (req.baseUrl.includes('organization-agreement')) {
      folder = 'uploads/agreements';
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  }
});


export const upload = multer({ storage })