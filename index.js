const express = require("express");
const server = express();
server.use(express.json());
//query params =?teste=1
//route params =/users/1
//request body ={"name":"Breno"}
/** 
* Devo utilizar a variável'numberOfRequests'como 
'let', pois a mesma irá sofrer mutação.
A váriavel 'projects' pode ser 'const' porque
um 'array' pode receber adições ou exclusões 
mesmos endo uma constante
*/
let numberOfRequests = 0;
const projects = [];
/**
 * Middleware que checa se o projeto existe
 */
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Projeto não encontrado" });
  }
  return next();
}

/**
 * Middleware que da o log do número de requisições
 */
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);
  return next();
}

server.use(logRequests);
/**
 * Projetos
 *
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", (req, res) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  return res.json(project);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.put("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

server.delete("/projects/:id", checkProjectExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

server.post("/projects/:id/tasks", checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000);
