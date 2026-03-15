const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/chatbotController');

// POST route for chatbot messages
router.post('/chat', sendMessage);

module.exports = router;
