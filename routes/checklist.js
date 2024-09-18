var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Secret key for JWT
const JWTSECRET = process.env.JWTSECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Get the token from the header
  if (!token) return res.sendStatus(401); // No token found
  jwt.verify(token, JWTSECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Token is no longer valid
      next(); // Proceed to the next middleware or route handler
  });
};

// DUMMY CHECKLIST DATA
const checklists = [
  {
    checklistId: 1,
    tasks: [
      { id: 1, task: 'Buy groceries', completeStatus: false },
      { id: 2, task: 'Walk the dog', completeStatus: true }
    ]
  },
  {
    checklistId: 2,
    tasks: [
      { id: 3, task: 'Finish homework', completeStatus: false },
      { id: 4, task: 'Read a book', completeStatus: true },
      { id: 5, task: 'Clean the house', completeStatus: false }
    ]
  }
];

// CHECKLIST

// Endpoint to get all Checklist
router.post('/', authenticateToken, (req, res) => {
  const { tasks } = req.body;

  // Basic validation
  if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ success: false, message: 'Tasks are required and must be an array.' });
  }

  // Generate a new checklist ID
  const newChecklistId = checklists.length ? checklists[checklists.length - 1].checklistId + 1 : 1;

  const newChecklist = {
      checklistId: newChecklistId,
      tasks: tasks.map((task, index) => ({
          id: index + 1, // Simple ID generation for tasks
          task: task.task,
          completeStatus: task.completeStatus || false
      }))
  };

  checklists.push(newChecklist);
  res.status(201).json({ success: true, message: 'Checklist created successfully.', checklist: newChecklist });
});

// Endpoint to insert new Checklist
router.get('/', authenticateToken,  (req, res) => {
  res.json({ success: true, message: 'Checklist retrieved successfully.', items: checklists });
});

// Endpoint to delete a checklist by checklistId
router.delete('/:checklistId', authenticateToken,  (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const index = checklists.findIndex(c => c.checklistId === checklistId);

  if (index === -1) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  checklists.splice(index, 1);
  res.json({ success: true, message: 'Checklist deleted successfully. Checklist Remaining: ', items: checklists });
});

// Endpoint to get a specific checklist by checklistId
router.get('/:checklistId', authenticateToken,  (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  res.json({ success: true, message: 'Checklist retrieved successfully.', checklist });
});

// Endpoint to insert a task into an active checklist
router.post('/:checklistId/item', authenticateToken,  (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  const { task, completeStatus } = req.body;

  // Basic validation
  if (!task) {
      return res.status(400).json({ success: false, message: 'Task is required.' });
  }

  // Generate a new task ID based on the existing tasks
  const newTaskId = checklist.tasks.length ? checklist.tasks[checklist.tasks.length - 1].id + 1 : 1;

  const newTask = {
      id: newTaskId,
      task,
      completeStatus: completeStatus || false
  };

  checklist.tasks.push(newTask);
  res.status(201).json({ success: true, message: 'Task added successfully.', task: newTask, currentItems: checklists });
});

// Endpoint to get a specific task in a specific checklist
router.get('/:checklistId/item/:taskId', authenticateToken, (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  const task = checklist.tasks.find(t => t.id === taskId);

  if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  res.json({ success: true, message: 'Task retrieved successfully.', task });
});

// Endpoint to update the status of a specific task in a specific checklist
router.put('/:checklistId/item/:taskId', authenticateToken, (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  const task = checklist.tasks.find(t => t.id === taskId);

  if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const { completeStatus } = req.body;

  // Update the task status
  if (completeStatus !== undefined) {
      task.completeStatus = completeStatus;
  }

  res.json({ success: true, message: 'Task status updated successfully.', task });
});

// Endpoint to delete specific task in a checklist
router.delete('/:checklistId/item/:taskId', authenticateToken, (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  const taskIndex = checklist.tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  checklist.tasks.splice(taskIndex, 1);
  res.json({ success: true, message: 'Task deleted successfully. Remaining Task: ', items: checklists});
});

// Endpoint to update the status of a specific task in a specific checklist
router.put('/:checklistId/item/rename/:taskId', authenticateToken, (req, res) => {
  const checklistId = parseInt(req.params.checklistId, 10);
  const taskId = parseInt(req.params.taskId, 10);
  const checklist = checklists.find(c => c.checklistId === checklistId);

  if (!checklist) {
      return res.status(404).json({ success: false, message: 'Checklist not found.' });
  }

  const task = checklist.tasks.find(t => t.id === taskId);

  if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
  }

  const { newTaskName } = req.body;

  // Basic validation
  if (!newTaskName) {
      return res.status(400).json({ success: false, message: 'New task name is required.' });
  }

  // Update the task name
  task.task = newTaskName;

  res.json({ success: true, message: 'Task name updated successfully.', items: checklists });
});

module.exports = router;