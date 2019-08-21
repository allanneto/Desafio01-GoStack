const express = require("express");

const server = express();

server.use(express.json());

let numberOfReqs = 0;
const projectList = [];

const checkIdExists = (req, res, next) => {
  const { id } = req.params;
  const project = projectList.find(p => p.id == id);

  if (!project) {
    res.status(400).json({ message: "Project not Found" });
  }
  next();
};

const logRequests = (req, res, next) => {
  numberOfReqs++;

  console.log(`Numbers of Requests: ${numberOfReqs}`);

  return next();
};

server.use(logRequests);

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projectList.push(project);

  res.json(projectList);
});

server.get("/projects", (req, res) => {
  res.json(projectList);
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectList.find(p => p.id == id);

  project.title = title;

  res.json(project);
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projectList.findIndex(p => p.id == id);

  projectList.splice(projectIndex);

  res.send();
});

server.post("/projects/:id/tasks", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectList.find(p => p.id == id);

  project.tasks.push(title);

  res.send();
});

server.listen(3002);
