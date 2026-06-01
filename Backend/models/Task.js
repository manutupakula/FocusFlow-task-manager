const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['todo', 'in-progress', 'done'],
    default: 'todo'
  },

  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },

  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  category: {
    type: String,
    enum: ['work', 'study', 'personal'],
    default: 'work'
  },

  dueDate: {
    type: Date
  },

  assignedTo: {
    type: String,
    default: ''
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);