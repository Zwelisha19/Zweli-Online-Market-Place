
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')

dotenv.config()


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('api/auth',authRoutes)


app.listen(PORT,()=> console.log(`Server has started on port ${PORT}`))





