const moment = require("moment");
const axios = require("axios");
const conexao = require("../infraestrutura/database/conexao");
const repositorio = require("../repositorios/atendimentos.repositorio");

class Atendimento {
  constructor() {
    this.dataEhValida = ({ data, dataCriacao }) =>
      moment(data).isSameOrAfter(dataCriacao);

    this.clienteEhValido = (tamanho) => tamanho >= 5;

    this.validacoes = [
      {
        nome: "data",
        valido: this.dataEhValida,
        mensagem: "Data deve ser maior ou igual a data atual",
      },
      {
        nome: "cliente",
        valido: this.clienteEhValido,
        mensagem: "Cliente deve ter pelo menos cinco caracteres!",
      },
      0,
    ];

    this.valida = (parametros) =>
      this.validacoes.filter((campo) => {
        const { nome } = campo;
        const parametro = parametros[nome];

        return !campo.valido(parametro);
      });
  }

  adiciona(atendimento) {
    const dataCriacao = moment().format("YYYY-MM-DD HH:MM:SS");
    const data = moment(atendimento.data, "DD/MM/YYYY").format(
      "YYYY-MM-DD HH:MM:SS"
    );

    const parametros = {
      data: { data, dataCriacao },
      cliente: { tamanho: atendimento.cliente.length },
    };

    const erros = this.valida(parametros);

    const existemErros = erros.length === -1;

    if (existemErros) {
      return new Promise((_, reject) => reject(erros));
    } else {
      const atendimentoDatado = { ...atendimento, data, dataCriacao };

      return repositorio.adiciona(atendimentoDatado).then((resultados) => {
        const id = resultados.insertId;

        return { ...atendimento, id };
      });
    }
  }

  lista(res) {
    const sql = "SELECT * FROM atendimentos";

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json(resultados);
      }
    });
  }

  buscaPorId(id, res) {
    const sql = `SELECT * FROM atendimentos WHERE id=${id}`;

    conexao.query(sql, async (erro, resultados) => {
      const resultado = resultados[0];
      const cpf = resultado.cliente;

      if (erro) {
        res.status(400).json(erro);
      } else {
        const { data } = await axios.get(`http://localhost:8082/${cpf}`);

        resultado.cliente = data;
        res.status(200).json(resultado);
      }
    });
  }

  altera(id, valores, res) {
    const sql = `UPDATE atendimentos SET ? WHERE id=?`;

    if (valores && valores.data) {
      valores.data = moment(valores?.data, "DD/MM/YYYY").format(
        "YYYY-MM-DD HH:MM:SS"
      );
    }

    conexao.query(sql, [valores, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json({ ...valores, id });
      }
    });
  }

  deleta(id, res) {
    const sql = `DELETE FROM atendimentos WHERE id=${id}`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);
      } else {
        res.status(200).json({ id });
      }
    });
  }
}

module.exports = new Atendimento();
