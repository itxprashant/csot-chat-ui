const express = require('express');
const app = express();
const mongoose = require('mongoose');
// import bcrypt from "bcryptjs";
const bcrypt = require('bcryptjs');
const cors = require('cors');
// models
const { Chat } = require('./models/chat');
const { ChatList } = require('./models/chatlist');
const { User } = require('./models/user');

const saltRounds = 10;

// Use environment variable for MongoDB connection or fallback to MongoDB Atlas
const uri = "mongodb+srv://prashantt492:GuqFE9OgmZiwjO3S@cluster0.akh0s1t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const mongoUrl = process.env.MONGODB_URI || uri;

// const mongoUrl = 'mongodb://localhost:27017/mydatabase'; // Change this to your MongoDB URI

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.use(express.json());
app.use(cors({
    origin: "*",
}))


async function createUser(name, email, password) {

    try {
        // Hash password using bcrypt
        const hashedPassword = bcrypt.hashSync(password, saltRounds);

        // create new user instance
        const user = new User({ name, email, password: hashedPassword });

        // save user to mongodb database
        await user.save();
        console.log('User created successfully');
    } catch (err) {
        console.error('Error creating user:', err);
    }

}

// create a new user
// createUser("kyran", "kyran@gmail.com", "password")
// createUser("tom", "tom@gmail.com", "password")
// createUser("john", "john@gmail.com", "password")

async function authenticateUser(email, password) {
    // 0: success, 1: user not found, 2: password mismatch

    console.log(`Attempting to authenticate user with email: ${email}`);
    
    try {
        const user = await User.findOne({ email: email });
        console.log(`User lookup result:`, user ? 'User found' : 'User not found');
        
        if (!user) {
            console.log('No user found with that email');
            return 1;
        }

        // compare password with hashed password
        const result = await bcrypt.compare(password, user.password);
        console.log(`Password comparison result: ${result}`);
        
        if (result) {
            console.log('Authentication successful');
            return 0;
        } else {
            console.log('Authentication failed');
            return 2;
        }
    } catch (err) {
        console.error('Error during authentication:', err);
        throw err;
    }
}

function deleteUser(email) {

    User.deleteOne({ email: email }, function (err) {
        if (err) throw err;
        console.log('User deleted successfully');
    });
}

function changeName(email, newName) {
    // find user by email and update name
    User.findOne({ email: email }, function (err, user) {
        if (err) throw err;
        if (!user) {
            console.log('No user found with that email');
            return;
        }

        user.name = newName;

        user.save()
            .then(() => {
                console.log('User name updated successfully');
            })
            .catch(err => {
                console.error('Error updating user name:', err);
            });
    });
}

// Only start the server if not in Vercel environment
// if (process.env.NODE_ENV !== 'production') {
//     const PORT = process.env.PORT || 8000;
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// }
app.listen(8000, () => {
    console.log('Server is running on port 8000');
});


// Export the app for Vercel
module.exports = app;

app.get('/api', (req, res) => {
    res.send('Hello, ' + (req.query.name || 'World'));
});

app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    createUser(name, email, password)
        .then(() => {
            res.status(201).send('User registered successfully');
        })
        .catch(err => {
            console.error('Error during registration:', err);
            res.status(500).send('Error during registration');
        });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    authenticateUser(email, password)
        .then(result => {
            if (result === 0) {
                // If authentication is successful, also return user data
                User.findOne({ email: email })
                    .then(user => {
                        if (user) {
                            res.status(200).json({
                                message: 'Login successful',
                                name: user.name,
                                email: user.email,
                                id: user._id
                            });
                        } else {
                            res.status(404).send('User not found');
                        }
                    })
                    .catch(err => {
                        console.error('Error fetching user data:', err);
                        res.status(500).send('Error fetching user data');
                    });
            } else if (result === 1) {
                res.status(404).send('User not found');
            } else if (result === 2) {
                res.status(401).send('Incorrect password');
            }
        })
        .catch(err => {
            console.error('Error during login:', err);
            res.status(500).send('Error during login');
        });
});

app.get('/api/auth/profile', (req, res) => {
    // get user profile by email
    const { email } = req.query;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.status(200).json({ name: user.name, email: user.email });
        }).catch(err => {
            console.error('Error fetching user profile:', err);
            res.status(500).send('Error fetching user profile');
        })
});

app.get('/api/users', (req, res) => {
    // get all users (excluding passwords)
    User.find({}, '-password')
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            console.error('Error fetching users:', err);
            res.status(500).send('Error fetching users');
        });
});

// Debug route to check database status
app.get('/api/debug/db-status', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const users = await User.find({}, 'name email');
        res.status(200).json({
            connected: mongoose.connection.readyState === 1,
            userCount,
            users,
            dbName: mongoose.connection.db.databaseName
        });
    } catch (err) {
        console.error('Error checking database status:', err);
        res.status(500).json({ error: 'Error checking database status' });
    }
});

// test function to create a user
// createUser("kyran", "kyran@gmail.com", "password");

// test function to authenticate a user
// authenticateUser("kyran@gmail.com", "password");


// create a chat between two users
// const newChat = new Chat({
//     message: "Hello, how are you?",
//     sender: "kyran@gmail.com",
//     reciever: "john@gmail.com",
//     date: new Date(),
//     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute
// : '2-digit' }),
//     status: "sent",
//     img_url: ""
// });
// newChat.save();

// set user status to online or offline

app.post('/api/users/status', (req, res) => {
    const { email, status } = req.body;

    if (!email || !status) {
        return res.status(400).send('Email and status are required');
    }

    User.findOneAndUpdate({ email: email }, { status: status }, { new: true })
        .then(user => {
            if (!user) {
                return res.status(404).send('User not found');
            }
            res.status(200).json({ 
                message: 'Status updated successfully',
                user: { name: user.name, email: user.email, status: user.status }
            });
        })
        .catch(err => {
            console.error('Error updating user status:', err);
            res.status(500).send('Error updating user status');
        });
})