const Atendimento = require('../models/atendimentos')

module.exports = app => {
  app.get('/atendimentos', (_, response) => {
    Atendimento.lista(response)
  });

  app.post('/atendimentos', (request, response) => {
    const atendimento = request.body;

    Atendimento.adiciona(atendimento, response);
  })
}