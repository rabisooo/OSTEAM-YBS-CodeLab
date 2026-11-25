const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// İstemciden gelen JSON verisini okumak ve farklı portlardan erişime izin vermek için middleware'ler
app.use(cors());
app.use(express.json());

// Her isteğin HTTP metodunu ve URL yolunu terminale yazdıran logger middleware
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Bellekte (in-memory) tutulan örnek görev dizisi; sunucu yeniden başlayınca sıfırlanır
let tasks = [
  { id: 1, title: "MIS 457 Lab çalışması", completed: false },
  { id: 2, title: "Postman ile API testlerini yap", completed: false }
];

// Tüm görevleri listele (200 OK)
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// ID değerine göre tek bir görevi getir (200 OK veya 404 Not Found)
app.get("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.json(task);
});

// Yeni görev oluştur (201 Created veya 400 Bad Request)
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: "title is required" });
  }

  const newTask = {
    id: Date.now(),
    title: String(title).trim(),
    completed: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Mevcut görevi güncelle (200 OK veya 404 Not Found)
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (req.body.title !== undefined) {
    task.title = String(req.body.title).trim();
  }
  if (req.body.completed !== undefined) {
    task.completed = Boolean(req.body.completed);
  }

  res.json(task);
});

// ID değerine göre görevi sil (204 No Content veya 404 Not Found)
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const exists = tasks.some((t) => t.id === id);

  if (!exists) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks = tasks.filter((t) => t.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
});