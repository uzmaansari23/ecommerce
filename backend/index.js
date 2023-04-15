const express = require('express')
const cors = require('cors')
const app = express()
const db = require('./model/connection')

const multer = require("multer");
app.use(cors())
app.use(express.json())
app.use('/user',require('./routes/users'))
app.use('/product',require('./routes/product'))
const PORT = 5000
app.listen(PORT,console.log(`Server is running at ${PORT}`))

