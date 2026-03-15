import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://automatic-queue-system.onrender.com/api/send-otp', { email });
      setIsOtpSent(true);
      alert("OTP sent to your email!");
    } catch (err) { alert("Error sending OTP"); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://automatic-queue-system.onrender.com/api/verify-otp', { email, otp });
      if (res.data.success) {
        // Save customer session and go to Register page
        localStorage.setItem('customerEmail', email);
        navigate('/register'); 
      }
    } catch (err) { alert("Invalid OTP"); }
  };

  return (
    <div className="container card">
      <h2>Customer Portal</h2>
      {!isOtpSent ? (
        <form onSubmit={handleSendOTP}>
          <p>Enter email to receive a login OTP</p>
          <input type="email" placeholder="Email Address" onChange={(e)=>setEmail(e.target.value)} required />
          <button type="submit" className="btn-primary">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <p>Enter the 6-digit code sent to {email}</p>
          <input type="text" placeholder="6-Digit OTP" onChange={(e)=>setOtp(e.target.value)} required />
          <button type="submit" className="btn-primary">Verify & Login</button>
        </form>
      )}
    </div>
  );
};

export default CustomerLogin;
