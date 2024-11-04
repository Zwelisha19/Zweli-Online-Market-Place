
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')
const cors = require('cors');
 

dotenv.config()


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);


app.listen(PORT,()=> console.log(`Server has started on port ${PORT}`))





