



const admin = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { email, password, userType } = req.body;

    if (!email || !password || !userType) {
        return res.status(400).json({ message: 'Email, password, and user type are required.' });
    }

    try {
        
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });
e
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            userType,
            createdAt: new Date(),
        });

        res.status(201).json({ message: `User registered with ID: ${userRecord.uid}` });
    } catch (error) {
        console.error(`Error registering user: ${error.code} - ${error.message}`);
        if (error.code === 'auth/email-already-exists') {
            return res.status(400).json({ message: 'Email already in use.' });
        }
        res.status(500).json({ message: `Error registering user: ${error.message}` });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        
        const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

       
        const isPasswordValid = await bcrypt.compare(password, userData.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        res.status(200).json({ message: `Welcome back, ${email}!` });
    } catch (error) {
        console.error(`Error logging in: ${error.message}`);
        res.status(500).json({ message: 'Error logging in' });
    }
};

module.exports = { registerUser, loginUser };
