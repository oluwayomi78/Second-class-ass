const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const { fetchData, loginPage } = require('../controllers/user.controller');

const saltRounds = 10;

// Render signup form
router.get('/signup', fetchData);

// Handle signup form submission
router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send('Email already registered');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.redirect('/user/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).send('Internal server error');
    }
});

// Render login form
router.get('/login', loginPage);

// Handle login logic
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect password');
        }

        // Success: render dashboard directly
        res.status(200).send(`
            <style>
                body { font-family: Arial; margin: 0; background: #f1f1f1; }
                .dashboard { display: flex; height: 100vh; }
                .sidebar { width: 200px; background: #111; color: #fff; padding: 20px; }
                .sidebar h2 { text-align: center; margin-bottom: 30px; }
                .sidebar nav a { color: #ccc; text-decoration: none; display: block; padding: 10px; margin-bottom: 10px; border-radius: 5px; }
                .sidebar nav a:hover { background: #333; color: #fff; }
                .main { flex: 1; display: flex; flex-direction: column; }
                .topbar { background: #fff; padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
                .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 20px; }
                .card { background: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .profile { display: flex; align-items: center; gap: 10px; }
                .profile-picture { width: 50px; height: 50px; border-radius: 50%; background: #ccc; display: flex; justify-content: center; align-items: center; }
                .search input { padding: 10px; width: 300px; border-radius: 5px; border: 1px solid #ddd; }
            </style>
            <div class="dashboard">
                <aside class="sidebar">
                    <h2>MyDash</h2>
                    <nav>
                        <a href="#">🏠 Home</a>
                        <a href="#">📊 Analytics</a>
                        <a href="#">📁 Files</a>
                        <a href="#">⚙️ Settings</a>
                    </nav>
                </aside>
                <main class="main">
                    <header class="topbar">
                        <h1>Dashboard</h1>
                        <div class="search">
                            <input type="text" placeholder="Search..." />
                        </div>
                        <div class="profile">
                            <div class="profile-picture">👤</div>
                            <div><h4>${user.firstName} ${user.lastName}</h4></div>
                        </div>
                    </header>
                    <section class="cards">
                        <div class="card"><h3>Visitors</h3><p>2,430</p></div>
                        <div class="card"><h3>Sales</h3><p>$1,200</p></div>
                        <div class="card"><h3>Orders</h3><p>320</p></div>
                    </section>
                </main>
            </div>
        `);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
