const path =require('path');
const cors = require('cors');
const express = require('express');
const connection = require('./db/connection');
const userRoutes = require('./routes/users.route'); 
const productsRoutes = require('./routes/products.route'); 

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connection();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});