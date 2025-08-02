const path =require('path');
const cors = require('cors');
const express = require('express');
const connection = require('./db/connection');
const userRoutes = require('./routes/users.route'); 
const productsRoutes = require('./routes/products.route'); 

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productsRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connection();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});