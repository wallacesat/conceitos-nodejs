const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  repositories.push({ id: uuid(), title, url, techs, likes: 0 });
  return response.json(repositories[repositories.length-1]);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id} = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: "Repositório não encontrado"});
  }

  repositories[repoIndex] = { ...repositories[repoIndex], ...{ title, url, techs }}

  return response.json(repositories[repoIndex]);

});

app.delete("/repositories/:id", (request, response) => {
  const { id} = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: "Repositório não encontrado"});
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id} = request.params;

  const repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: "Repositório não encontrado"});
  }

  repositories[repoIndex] = { ...repositories[repoIndex], ...{ likes: repositories[repoIndex].likes+1 }};

  return response.json(repositories[repoIndex]);
});

module.exports = app;
