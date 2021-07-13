const query = require("../infraestrutura/database/queries");

class Pets {
  adiciona(pet) {
    const sql = "INSERT INTO pets SET ?";

    return query(sql, pet);
  }
}
