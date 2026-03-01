const initOracle = require('./db')
const express = require('express')
var cors = require('cors') 
const bodyParser = require("body-parser");

const app = express();

// Increase payload limit to handle large base64 images
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


// connectToOracle();
initOracle();



// const app = express()
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