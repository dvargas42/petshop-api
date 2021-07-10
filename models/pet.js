const conexao = require("../infraestrutura/database/conexao");
const uploadDeArquivos = require("../infraestrutura/arquivos/uploadDeArquivos");

class Pet {
  adiciona(pet, res) {
    const sql = "INSERT INTO pets SET ?";

    uploadDeArquivos(pet.imagem, pet.nome, (erro, novoCaminho) => {
      if (erro) {
        res.status(400).json({ erro });
      } else {
        const novoPet = { nome: pet.nome, imagem: novoCaminho };

        conexao.query(sql, pet, (erro) => {
          if (erro) {
            res.status(400).json(erro);
          } else {
            res.status(201).json(novoPet);
          }
        });
      }
    });
  }
}

module.exports = new Pet();
