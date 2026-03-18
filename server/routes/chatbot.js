const express = require('express');
const router = express.Router();
const multer = require('multer');
const { sendMessage } = require('../controllers/chatbotController');

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 10 * 1024 * 1024,
	},
	fileFilter: (_req, file, cb) => {
		const isPdf = file.mimetype === 'application/pdf';
		const isImage = file.mimetype?.startsWith('image/');

		if (isPdf || isImage) {
			cb(null, true);
			return;
		}

		cb(new Error('Only PDF and image files are supported'));
	}
});

const uploadAttachment = (req, res, next) => {
	upload.single('attachment')(req, res, (err) => {
		if (!err) {
			next();
			return;
		}

		if (err instanceof multer.MulterError) {
			if (err.code === 'LIMIT_FILE_SIZE') {
				return res.status(400).json({ success: false, error: 'File size must be less than 10MB.' });
			}

			return res.status(400).json({ success: false, error: err.message || 'File upload failed.' });
		}

		return res.status(400).json({ success: false, error: err.message || 'Invalid file upload.' });
	});
};

// POST route for chatbot messages
router.post('/chat', uploadAttachment, sendMessage);

module.exports = router;
