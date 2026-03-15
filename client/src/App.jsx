import { useState, useEffect } from 'react';
import axios from 'axios';
import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CustomerLogin from './components/CustomerLogin';

const firebaseConfig = {
  apiKey: "AIzaSyByA6W92GEYYreOHBkRRWqrEjcX8XPpuP0",
  authDomain: "queue-system-88f09.firebaseapp.com",
  projectId: "queue-system-88f09",
  storageBucket: "queue-system-88f09.firebasestorage.app",
  messagingSenderId: "1044486820732",
  appId: "1:1044486820732:web:38129f3c45a7df38174af9"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

function App() {
  const [name, setName] = useState('');
  const [token, setToken] = useState(null);
  const [waitingList, setWaitingList] = useState([]);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchQueue = async () => {
    try {
      const res = await axios.get('https://automatic-queue-system.onrender.com/api/queue');
      setWaitingList(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchQueue();
    onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Staff Logged In!");
    } catch (err) { alert("Login Error: " + err.message); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://automatic-queue-system.onrender.com/api/register', { name });
      setToken(res.data.tokenNumber);
      setName('');
      fetchQueue();
    } catch (err) { alert("Registration Failed!"); }
  };

  const handleCallNext = async () => {
    try {
      const idToken = await auth.currentUser.getIdToken();
      await axios.post('https://automatic-queue-system.onrender.com/api/call-next', {}, {
        headers: { Authorization: `Bearer ${idToken}` }
      });
      fetchQueue();
    } catch (err) { alert("Unauthorized! Please login."); }
  };

  return (
    <Router>
      <div className="container">
        <nav style={{ padding: '20px', background: '#fff', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
          <Link to="/" style={{ marginRight: '20px', fontWeight: 'bold', color: '#0056b3' }}>Customer Portal</Link>
          <Link to="/staff" style={{ fontWeight: 'bold', color: '#0056b3' }}>Staff Portal</Link>
        </nav>

        <h1 className="main-title">Queue Management System</h1>

        <Routes>
          <Route path="/" element={<CustomerLogin />} />
          <Route path="/register" element={
            <div className="card">
              {!token ? (
                <form onSubmit={handleRegister}>
                  <h2>Kiosk Registration</h2>
                  <input type="text" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full Name" required />
                  <button type="submit" className="btn-primary">Get Token</button>
                </form>
              ) : (
                <div className="token-success">
                  <h2>Your Token:</h2>
                  <div className="token-display">{token}</div>
                  <button onClick={() => setToken(null)} className="btn-primary">Register Another</button>
                </div>
              )}
            </div>
          } />
          <Route path="/staff" element={
            <div className="staff-section">
              <div className="card">
                {!user ? (
                  <form onSubmit={handleLogin}>
                    <h3>Staff Login</h3>
                    <input type="email" placeholder="Email" onChange={(e)=>setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} required />
                    <button type="submit" className="btn-primary">Login</button>
                  </form>
                ) : (
                  <div className="user-info">
                    <span>Logged in: <b>{user.email}</b></span>
                    <button onClick={() => signOut(auth)} className="logout-btn" style={{marginLeft: '10px'}}>Logout</button>
                  </div>
                )}
              </div>
              {user && (
                <div className="card">
                  <h2>Live Queue Dashboard</h2>
                  <button onClick={handleCallNext} className="btn-success">Call Next Customer ✅</button>
                  <div className="queue-grid">
                    {waitingList.map(t => (
                      <div key={t._id} className="queue-item">
                        <div className="token-number">{t.tokenNumber}</div>
                        <div className="customer-name">{t.customerName}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
