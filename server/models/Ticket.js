const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  tokenNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['waiting', 'serving', 'completed'], 
    default: 'waiting' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Ticket', ticketSchema);
