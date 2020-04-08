const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());
app.use(cors());

const repositories = [];

function validateID(req, res, next) {
  const { id } = req.params;
  if (!isUuid(id)) {
    return res.status(400).json({ erro: "invalid ID" });
  }
  next();
}

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const project = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(project);
  response.status(200).json(project);
});

app.put("/repositories/:id", validateID, (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (!projectIndex < 0) {
    return response.status(400).json({ error: "Invalid ID" });
  }
  repositories[projectIndex] = {
    id,
    title,
    url,
    techs,
    likes: repositories[projectIndex].likes,
  };
  return response.status(200).json(repositories[projectIndex]);
});

app.delete("/repositories/:id", validateID, (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (!projectIndex < 0) {
    return response.status(400).json({ error: "Invalid ID" });
  }
  repositories.splice(projectIndex, 1);
  response.status(204).send();
});

app.post("/repositories/:id/like", validateID, (request, response) => {
  const { id } = request.params;
  const projectIndex = repositories.findIndex((project) => project.id === id);
  if (!projectIndex < 0) {
    return response.status(400).json({ error: "Invalid ID" });
  }
  repositories[projectIndex].likes += 1;
  response.json(repositories[projectIndex]);
});

module.exports = app;
