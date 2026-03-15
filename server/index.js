const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const queueRoutes = require('./routes/queueRoutes');
const app = express();
app.use(cors()); 
app.use(express.json());

// Replace your connect line with this one:
mongoose.connect('mongodb://ajayravichandran31:ajay2005@ac-6qa9hv0-shard-00-00.ns8q8we.mongodb.net:27017,ac-6qa9hv0-shard-00-01.ns8q8we.mongodb.net:27017,ac-6qa9hv0-shard-00-02.ns8q8we.mongodb.net:27017/queueDB?ssl=true&replicaSet=atlas-7iwrxw-shard-0&authSource=admin&appName=Cluster0')
  .then(() => console.log("✅ MongoDB Connected (Cloud via Long String)"))
  .catch(err => console.log("❌ Connection Error:", err));


app.use('/api', queueRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server flying on http://localhost:${PORT}`));
// Render deployment fix - v1