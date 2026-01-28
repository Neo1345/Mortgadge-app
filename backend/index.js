const initOracle = require('./db')
const express = require('express')
var cors = require('cors') 

// connectToOracle();
initOracle();



const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/mortgde', require('./routes/mortgde'))
// app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Mortgde app backend listening at http://localhost:${port}`)
})

app.get('/',(req,res) => {
  res.send('hello akash')
  })