
const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cors = require('cors');
 

dotenv.config()


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json({ limit: '10mb' }));
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api',productRoutes)
app.use('/api', orderRoutes);



app.listen(PORT,()=> console.log(`Server has started on port ${PORT}`))





