const query = require("../infraestrutura/database/queries");

class Atendimento {
  adiciona(atendimento) {
    const sql = "INSERT INTO atendimentos SET ?";
    return query(sql, atendimento);
  }

  lista() {
    const sql = "SELECT * FROM atendimentos";
    return query(sql);
  }

  buscaPorId(id) {
    const sql = `SELECT * FROM atendimentos WHERE id=?`;
    return query(sql, id);
  }
  altera(id, valores) {
    const sql = "UPDATE atendimentos SET ? WHERE id=?";
    return query(sql, [valores, id]);
  }

  deleta(id) {
    const sql = "DELETE FROM atendimentos WHERE id=?";
    return query(sql, id);
  }
}

module.exports = new Atendimento();
