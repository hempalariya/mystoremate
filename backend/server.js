require('dotenv').config()
const express = require('express');

const userRoutes = require('./routes/users')

const app = express()

app.use(express.json())
app.use('/api/users', userRoutes)




const PORT = process.env.PORT || 7000
app.listen(PORT, () => console.log('listening on port ' + PORT))