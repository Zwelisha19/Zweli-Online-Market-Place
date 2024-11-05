
const admin = require('../config/firebaseConfig');


const createOrder = async (req, res) => {
    const { userId, items, total, paymentDetails } = req.body;

    
    if (!userId || !items || !total) {
        return res.status(400).send('Missing required fields.');
    }

    try {
        const orderRef = await admin.firestore().collection('orders').add({
            userId, 
            items,
            total,
            paymentDetails,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        res.status(201).send({ id: orderRef.id, message: 'Order created successfully.' });
    } catch (error) {
        console.error(`Error creating order: ${error.message}`);
        res.status(500).send('Error creating order');
    }
};


const getUserOrders = async (req, res) => {
    const { userId } = req.params;

    try {
        const snapshot = await admin.firestore().collection('orders').where('userId', '==', userId).get();
        const orders = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json(orders);
    } catch (error) {
        console.error(`Error retrieving orders: ${error.message}`);
        res.status(500).send('Error retrieving orders');
    }
};

module.exports = {
    createOrder,
    getUserOrders,
};
