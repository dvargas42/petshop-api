const moment = require('moment')
const conexao = require('../infraestrutura/conexao')

class Atendimento {
  adiciona(atendimento, res) {
    const dataCriacao = moment().format ('YYYY-MM-DD HH:MM:SS')
    const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    const sql = 'INSERT INTO atendimentos SET ?';

    const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
    const clienteEhValido = atendimento.cliente.length >= 5;

    const validacoes = [
      {
        nome: 'data',
        valido: dataEhValida,
        mensagem: 'Data deve ser maior ou igual a data atual'
      }, 
      {
        nome: 'cliente',
        valido: clienteEhValido,
        mensagem: 'Cliente deve ter pelo menos cinco caracteres!'
      }
    ]

    const erros = validacoes.filter(campo => !campo.valido);
    const existemErros = erros.length;

    if (existemErros) {
      res.status(400).json(erros);

    } else {
      const atendimentoDatado = { ...atendimento, data, dataCriacao };
  
      conexao.query(sql, atendimentoDatado, (erro, resultados) => {
        if (erro) {
          res.status(400).json(erro);
  
        } else {
          res.status(201).json(atendimento);
        }
      })
    }
  };

  lista(res) {
    const sql = 'SELECT * FROM atendimentos';

    conexao.query (sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);

      } else {
        res.status(200).json(resultados);
      }
    })
  };

  buscaPorId(id, res) {
    const sql = `SELECT * FROM atendimentos WHERE id=${id}`

    conexao.query(sql, (erro, resultados) => {
      const resultado =  resultados[0];

      if (erro) {
        res.status(400).json(erro);

      } else {
        res.status(200).json(resultado)
      }
    })
  };

  altera(id, valores, res){
    const sql = `UPDATE atendimentos SET ? WHERE id=?`;

    if (valores && valores.data) {
      valores.data = moment(valores?.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
    }

    conexao.query(sql, [valores, id], (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);

      } else {
        res.status(200).json({ ...valores, id });
      }
    })
  };

  deleta(id, res) {
    const sql = `DELETE FROM atendimentos WHERE id=${id}`;

    conexao.query(sql, (erro, resultados) => {
      if (erro) {
        res.status(400).json(erro);

      } else {
        res.status(200).json({id});
      }
    })
  }
}

module.exports =  new Atendimento;