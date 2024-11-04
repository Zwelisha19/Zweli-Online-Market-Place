const express = require('express');
const { 
    createProduct, 
    getProducts, 
    updateProduct, 
    deleteProduct, 
    hideProduct, 
    unhideProduct, 
    upload 
} = require('../controllers/productController'); 

const router = express.Router();

router.post('/products', upload.single('image'), createProduct);


router.get('/products', getProducts);


router.put('/products/:id', upload.single('image'), updateProduct);


router.delete('/products/:id', deleteProduct);


router.patch('/products/:id/hide', hideProduct);


router.patch('/products/:id/unhide', unhideProduct);

module.exports = router;
