const Atendimento = require('../models/atendimentos')

module.exports = app => {
  app.get('/atendimentos', (request, response) => {
    response.send('Você está na rota de atendimentos e está realizando um GET')
  });

  app.post('/atendimentos', (request, response) => {
    const atendimento = request.body;

    Atendimento.adiciona(atendimento, response);
  })
}