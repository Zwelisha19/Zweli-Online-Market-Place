const admin = require('../config/firebaseConfig');
const multer = require('multer');
const path = require('path');


const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });


const createProduct = async (req, res) => {
    const { name, description, price, available = true, isHidden = false } = req.body;

    
    if (!req.file) {
        return res.status(400).send('Image is required.');
    }

    try {
       
        const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

     
        const productRef = await admin.firestore().collection('products').add({
            name,
            description,
            price,
            available,
            isHidden,
            imageUrl, 
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).send(`Product created with ID: ${productRef.id}`);
    } catch (error) {
        console.error(`Error creating product: ${error.message}`);
        res.status(500).send('Error creating product');
    }
};



const getProducts = async (req, res) => {
    try {
        const snapshot = await admin.firestore().collection('products').get();
        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error(`Error retrieving products: ${error.message}`);
        res.status(500).send('Error retrieving products');
    }
};


const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, available, isHidden } = req.body;

   
    if (!name && !description && !price && available === undefined && isHidden === undefined && !req.file) {
        return res.status(400).send('At least one field (name, description, price, available, isHidden) or an image is required for update.');
    }

    try {
        const productRef = admin.firestore().collection('products').doc(id);
        const updates = {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price }),
            ...(available !== undefined && { available }),
            ...(isHidden !== undefined && { isHidden }),
        };

 
        if (req.file) {
            const imageUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            updates.imageUrl = imageUrl; 
        }

        await productRef.update(updates);

        res.status(200).send(`Product with ID: ${id} updated successfully.`);
    } catch (error) {
        console.error(`Error updating product: ${error.message}`);
        res.status(500).send('Error updating product');
    }
};



const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        await admin.firestore().collection('products').doc(id).delete();
        res.status(200).send(`Product with ID: ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting product: ${error.message}`);
        res.status(500).send('Error deleting product');
    }
};


const hideProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const productRef = admin.firestore().collection('products').doc(id);
        await productRef.update({ isHidden: true });
        res.status(200).send(`Product with ID: ${id} is now hidden.`);
    } catch (error) {
        console.error(`Error hiding product: ${error.message}`);
        res.status(500).send('Error hiding product');
    }
};


const unhideProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const productRef = admin.firestore().collection('products').doc(id);
        await productRef.update({ isHidden: false });
        res.status(200).send(`Product with ID: ${id} is now visible.`);
    } catch (error) {
        console.error(`Error unhiding product: ${error.message}`);
        res.status(500).send('Error unhiding product');
    }
};


module.exports = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    hideProduct,
    unhideProduct,
    upload,
};
