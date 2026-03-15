const Otp = require('../models/Otp');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ajayravichandran31@gmail.com', // Your Gmail
    pass: 'veqz lzyz pplv nlaw' // 16-character App Password
  }
});

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Save to DB
    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode }, 
      { upsert: true, new: true }
    );

    // 2. Send Email
    await transporter.sendMail({
      from: '"Queue System" <your-email@gmail.com>',
      to: email,
      subject: "Your Login OTP",
      text: `Your verification code is ${otpCode}. It expires in 5 minutes.`
    });

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = await Otp.findOne({ email, otp });

  if (record) {
    await Otp.deleteOne({ email }); // Use it once, then delete
    res.json({ success: true, message: "Login successful!" });
  } else {
    res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }
};
