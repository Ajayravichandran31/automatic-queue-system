const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');

router.get('/queue', queueController.getQueue);
router.post('/register', queueController.registerTicket);
router.post('/call-next', protect, queueController.callNext); // Protected!
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);
module.exports = router;
