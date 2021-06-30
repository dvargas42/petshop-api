module.exports = app => {
  app.get('/atendimentos', (request, response) => {
    response.send('Você está na rota de atendimentos e está realizando um GET')
  });
}