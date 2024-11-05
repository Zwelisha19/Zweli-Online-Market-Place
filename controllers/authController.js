// const admin = require('../config/firebaseConfig');
// const bcrypt = require('bcryptjs');

// const registerUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send('Email and password are required.');
//     }

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);

        
//         const userRecord = await admin.auth().createUser({
//             email,
//             password,
//         });

//         await admin.firestore().collection('users').add({
//             uid: userRecord.uid,
//             email,
         
//         });

//         res.status(201).send(`User registered with ID: ${userRecord.uid}`);
//     } catch (error) {
//         console.error(`Error registering user: ${error.code} - ${error.message}`);
//     if (error.code === 'auth/email-already-exists') {
//         return res.status(400).send('Email already in use.');
//     }
//     res.status(500).send(`Error registering user: ${error.message}`);
//     }
// };


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).send('Email and password are required.');
//     }

//     try {
        
//         const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();

//         if (userSnapshot.empty) {
//             return res.status(401).send('Invalid email or password.');
//         }

//         const userDoc = userSnapshot.docs[0];
//         const userData = userDoc.data();

        
//         const isPasswordValid = await bcrypt.compare(password, userData.password);

//         if (!isPasswordValid) {
//             return res.status(401).send('Invalid email or password.');
//         }

//         res.status(200).send(`Welcome back, ${email}!`);
//     } catch (error) {
//         console.error(`Error logging in: ${error.message}`); 
//         res.status(500).send('Error logging in');
//     }
// };

// module.exports = { registerUser, loginUser };




const admin = require('../config/firebaseConfig');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
    const { email, password, userType } = req.body; // Include userType

    if (!email || !password || !userType) {
        return res.status(400).json({ message: 'Email, password, and user type are required.' });
    }

    try {
        // Create user in Firebase Authentication
        const userRecord = await admin.auth().createUser({
            email,
            password,
        });

        // Store user data in Firestore
        await admin.firestore().collection('users').doc(userRecord.uid).set({
            uid: userRecord.uid,
            email,
            userType, // Store user type (role)
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
        // Fetch user from Firestore
        const userSnapshot = await admin.firestore().collection('users').where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        // Validate password (Note: If using Firebase Auth, you don't need to hash)
        // Using plain password since Firebase handles it
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
