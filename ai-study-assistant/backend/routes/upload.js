const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const pdfParseLib = require('pdf-parse');
const { storeDocument } = require('../rag/embeddings');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return cb(new Error('Only PDF files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
const acceptedFieldNames = new Set(['pdf', 'file', 'document']);

router.use('/upload', (req, res, next) => {
  if (req.method === 'GET') {
    req.method = 'POST';
  }
  next();
});

router.post('/upload', (req, res) => {
  const userId = req.userId;

  upload.any()(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: err.message });
    }

    if (err) {
      return res.status(400).json({ message: err.message || 'Upload failed' });
    }

    const uploadedFiles = Array.isArray(req.files) ? req.files : [];
    const targetFile =
      uploadedFiles.find((file) => acceptedFieldNames.has((file.fieldname || '').toLowerCase())) ||
      uploadedFiles[0];

    if (!targetFile) {
      return res.status(400).json({
        message: 'No file uploaded. Use multipart/form-data with field name "pdf", "file", or "document".',
      });
    }

    try {
      const fileBuffer = await fs.promises.readFile(targetFile.path);
      let text = '';

      if (typeof pdfParseLib === 'function') {
        const data = await pdfParseLib(fileBuffer);
        text = data.text || '';
      } else if (pdfParseLib && typeof pdfParseLib.PDFParse === 'function') {
        const parser = new pdfParseLib.PDFParse({ data: fileBuffer });
        try {
          const data = await parser.getText();
          text = data.text || '';
        } finally {
          await parser.destroy();
        }
      } else {
        throw new Error('Unsupported pdf-parse API');
      }

      await storeDocument(userId, text);

      return res.status(200).json({
        message: 'PDF uploaded and indexed successfully',
      });
    } catch (parseError) {
      return res.status(500).json({
        message: 'Failed to process PDF file',
        error: parseError.message || 'Unknown parse error',
      });
    }
  });
});

module.exports = router;
