const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

// ALL routes in this file are protected
// meaning you must be logged in (have a token) to use them

// ─────────────────────────────────────────
// GET ALL TASKS — GET /api/tasks
// ─────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    // Find only tasks that belong to the logged-in user
    // req.userId comes from the auth middleware (remember?)
    const tasks = await Task.find({ user: req.userId })
                            .sort({ createdAt: -1 }); // newest first

    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// CREATE TASK — POST /api/tasks
// ─────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    // Pull task details from request body
    const { title, description, status, dueDate, assignedTo } = req.body;

    // title is required — stop if it's missing
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create the task and link it to the logged-in user
    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      assignedTo,
      user: req.userId   // this links the task to the person who created it
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// UPDATE TASK — PUT /api/tasks/:id
// ─────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    // Find the task by its ID
    const task = await Task.findById(req.params.id);

    // Does this task even exist?
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Does this task belong to the logged-in user?
    // (stops people editing someone else's tasks)
    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not allowed to edit this task' });
    }

    // Update only the fields that were sent
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,           // whatever was sent in the request body
      { new: true }       // return the updated version, not the old one
    );

    res.status(200).json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE TASK — DELETE /api/tasks/:id
// ─────────────────────────────────────────
router.delete('/:id', protect, async (req, res) => {
  try {
    // Find the task by its ID
    const task = await Task.findById(req.params.id);

    // Does this task exist?
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Does it belong to the logged-in user?
    if (task.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not allowed to delete this task' });
    }

    // Delete it
    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Task deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;