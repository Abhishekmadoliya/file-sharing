const  express = require('express')
const app = express()
const port = 3000
const dotenv = require('dotenv')
dotenv.config()
const fileRoutes = require('./routes/fileRoutes')
const cors = require('cors')
app.use(cors())
// app.use("/uploads", express.static("uploads"))
app.use('/uploads', express.static('uploads'));
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))    


app.get('/app', (req, res) => res.send('Hello World!'))
app.use('/', fileRoutes)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))