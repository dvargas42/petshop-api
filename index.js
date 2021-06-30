const customExpress = require('./config/customExpress')

const app = customExpress()

app.listen(3000, () => {
  console.log('🚀 Servidor rodando na porta 3000!')
});