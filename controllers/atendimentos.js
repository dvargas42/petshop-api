const Atendimento = require("../models/atendimentos.model");

module.exports = (app) => {
  app.get("/atendimentos", (_, response) => {
    Atendimento.lista(response)
      .then((atendimentos) => response.json(atendimentos))
      .catch((erros) => response.status(400).json(erros));
  });

  app.get("/atendimentos/:id", (request, response) => {
    const id = parseInt(request.params.id);

    Atendimento.buscaPorId(id)
      .then((atendimento) => response.json(atendimento))
      .catch((erros) => response.status(400).json(erros));
  });

  app.post("/atendimentos", (request, response) => {
    const atendimento = request.body;

    Atendimento.adiciona(atendimento)
      .then((atendimentoCadastrado) => {
        response.status(201).json(atendimentoCadastrado);
      })
      .catch((erros) => response.status(400).json(erros));
  });

  app.patch("/atendimentos/:id", async (request, response) => {
    const id = parseInt(request.params.id);
    const valores = request.body;

    Atendimento.altera(id, valores)
      .then((valores) => response.json(valores))
      .catch((erros) => response.status(400).json(erros));
  });

  app.delete("/atendimentos/:id", (request, response) => {
    const id = parseInt(request.params.id);

    Atendimento.deleta(id)
      .then((atendimento) => response.json(atendimento))
      .catch((erros) => response.status(400).json(erros));
  });
};
