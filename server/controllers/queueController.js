const Ticket = require('../models/Ticket');

exports.getQueue = async (req, res) => {
  try {
    const queue = await Ticket.find({ status: 'waiting' }).sort({ createdAt: 1 });
    res.json(queue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerTicket = async (req, res) => {
  try {
    const { name } = req.body;
    const count = await Ticket.countDocuments();
    const token = `A-${101 + count}`;
    const newTicket = new Ticket({ tokenNumber: token, customerName: name });
    await newTicket.save();
    res.json(newTicket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.callNext = async (req, res) => {
  try {
    const next = await Ticket.findOneAndUpdate(
      { status: 'waiting' },
      { status: 'completed' },
      { sort: { createdAt: 1 }, new: true }
    );
    if (!next) return res.status(400).json({ message: "Queue is empty" });
    res.json(next);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
