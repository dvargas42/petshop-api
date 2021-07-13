const Pet = require("../models/pet");

module.exports = (app) => {
  app.post("/pets", (request, response) => {
    const pet = request.body;

    Pet.adiciona(pet)
      .then((novoPet) => response.json(novoPet))
      .catch((erros) => response.status(400).json(erros));
  });
};
