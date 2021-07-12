const moment = require("moment");
const axios = require("axios");
const conexao = require("../infraestrutura/database/conexao");
const repositorio = require("../repositorios/atendimentos.repositorio");

class Atendimento {
  constructor() {
    this.dataEhValida = ({ data, dataCriacao }) =>
      moment(data).isSameOrAfter(dataCriacao);

    this.clienteEhValido = (tamanho) => tamanho === 11;

    this.validacoes = [
      {
        nome: "data",
        valido: this.dataEhValida,
        mensagem: "Data deve ser maior ou igual a data atual",
      },
      {
        nome: "cliente",
        valido: this.clienteEhValido,
        mensagem: "CPF do cliente deve ter 11 caracteres!",
      },
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

  lista() {
    return repositorio.lista();
  }

  buscaPorId(id) {
    return repositorio.buscaPorId(id).then((resultados) => {
      const resultado = resultados[0];
      const cpf = resultado.cliente;

      return axios.get(`http://localhost:8082/${cpf}`).then((resp) => {
        resultado.cliente = resp.data;

        return resultado;
      });
    });
  }

  altera(id, valores) {
    if (valores && valores.data) {
      valores.data = moment(valores.data, "DD/MM/YYYY").format(
        "YYYY-MM-DD HH:MM:SS"
      );
    }
    return repositorio.altera(id, valores).then(() => {
      return { ...valores, id };
    });
  }

  deleta(id) {
    return repositorio.deleta(id).then((atendimento) => {
      return atendimento;
    });
  }
}

module.exports = new Atendimento();
