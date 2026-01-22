const express = require("express");
const app = express();

app.use(express.json()); // for JSON body

let tasks = []; // in-memory storage
let idCounter = 1;

/**
 * GET /tasks
 * Read all tasks
 */
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

/**
 * GET /tasks/:id
 * Read one task
 */
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json(task);
});

/**
 * POST /tasks
 * Create a new task
 * body: { "title": "Learn Express" }
 */
app.post("/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const newTask = {
    id: idCounter++,
    title: title.trim(),
    completed: false,
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

/**
 * PUT /tasks/:id
 * Update a task
 * body: { "title": "New title", "completed": true }
 */
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, completed } = req.body;

  if (title !== undefined) task.title = title.trim();
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

/**
 * DELETE /tasks/:id
 * Delete a task
 */
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);

  if (index === -1) return res.status(404).json({ message: "Task not found" });

  const deleted = tasks.splice(index, 1);
  res.json({ message: "Task deleted", task: deleted[0] });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ TODO API running at http://localhost:${PORT}`);
});
