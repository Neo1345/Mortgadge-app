const initOracle = require('./db')
const express = require('express')
var cors = require('cors') 
const bodyParser = require("body-parser");

const app = express();
const path = require("path");


// Increase payload limit to handle large base64 images
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


// connectToOracle();
initOracle();

console.log(path.join(__dirname, "../build", "index.html"))

// const app = express()
const port = 5000

app.use(cors())
app.use(express.json())

// Available Routes
app.use('/api/mortgde', require('./routes/mortgde'))
// app.use('/api/notes', require('./routes/notes'))

app.use(express.static(path.join(__dirname, "../build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build", "index.html"));
// });

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});


app.listen(port, () => {
  console.log(`Mortgde app backend listening at http://localhost:${port}`)
})

app.get('/',(req,res) => {
  res.send('hello akash')
  })