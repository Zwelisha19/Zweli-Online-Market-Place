const admin = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');


const registerUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userRef = await admin.firestore().collection('users').add({
            email,
            password: hashedPassword,
        });
        res.status(201).send(`User registered with ID: ${userRef.id}`);
    } catch (error) {
        console.error(`Error registering user: ${error.message}`); 
        res.status(500).send('Error registering user');
    }
};


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();
        
        if (userSnapshot.empty) {
            return res.status(401).send('Invalid email or password.');
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid email or password.');
        }

      
        res.status(200).send(`Welcome back, ${email}!`);
    } catch (error) {
        console.error(`Error logging in: ${error.message}`); 
        res.status(500).send('Error logging in');
    }
};

module.exports = { registerUser, loginUser };
