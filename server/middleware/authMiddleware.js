const admin = require('firebase-admin');
const path = require('path');

// Ensure serviceAccount.json is in your server folder
const serviceAccountPath = path.resolve(__dirname, '../serviceAccount.json');

if (!admin.apps.length) {
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("🛡️  Firebase Admin Initialized");
  } catch (error) {
    console.error("❌ Error loading serviceAccount.json!");
  }
}

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return res.status(401).json({ message: "Not authorized! Please log in." });

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
