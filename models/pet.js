const repositorio = require("../repositorios/pets.repositorio");
const uploadDeArquivos = require("../infraestrutura/arquivos/uploadDeArquivos");

class Pet {
  adiciona(pet) {
    uploadDeArquivos(pet.imagem, pet.nome, (erro, novoCaminho) => {
      if (erro) {
        return new Promise((_, reject) => reject(erro));
      } else {
        const novoPet = { nome: pet.nome, imagem: novoCaminho };

        repositorio.adiciona(pet).then(() => novoPet);
      }
    });
  }
}

module.exports = new Pet();
