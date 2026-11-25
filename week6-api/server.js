const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get("/api/events", async (req, res) => {
  const events = await prisma.event.findMany({
    orderBy: { date: "asc" }
  });
  res.json(events);
});

app.get("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) {
    return res.status(404).json({ error: "Event not found" });
  }
  res.json(event);
});

app.post("/api/events", async (req, res) => {
  const { title, date } = req.body;
  if (!title || !date) {
    return res.status(400)
      .json({ error: "title and date are required" });
  }
  const event = await prisma.event.create({
    data: { title, date: new Date(date) }
  });
  res.status(201).json(event);
});

app.put("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  const found = await prisma.event.findUnique({ where: { id } });
  if (!found) {
    return res.status(404).json({ error: "Event not found" });
  }
  const data = {};
  if (req.body.title) data.title = req.body.title;
  if (req.body.date) data.date = new Date(req.body.date);
  if (typeof req.body.done === "boolean") data.done = req.body.done;
  const event = await prisma.event.update({ where: { id }, data });
  res.json(event);
});

app.delete("/api/events/:id", async (req, res) => {
  const id = Number(req.params.id);
  const found = await prisma.event.findUnique({ where: { id } });
  if (!found) {
    return res.status(404).json({ error: "Event not found" });
  }
  await prisma.event.delete({ where: { id } });
  res.status(204).end();
});

app.listen(3000, () =>
  console.log("Server on http://localhost:3000"));
