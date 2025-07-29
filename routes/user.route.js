const express = require('express')
const router = express.Router();
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const { fetchData, loginPage } = require('../controllers/user.controller');
const saltRounds = 10;

router.get('/signup',fetchData )
router.post('/signup', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Hash the password first
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }

        // Create new user with hashed password
        const signupData = new userModel({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        signupData.save()
            .then(() => {
                res.redirect('/user/login');
            })
            .catch((error) => {
                console.error('Signup error:', error);
                res.status(500).send('Error signing up');
            });
    });
});

router.get('/login', loginPage)

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).send('User with this email not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect password');
        }

        // res.redirect('/user/Dashboard');
        res.status(200).send(
            `
                <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            background: #f1f1f1;
        }

        .dashboard {
            display: flex;
            height: 100vh;
        }

        .sidebar {
            width: 200px;
            background: #111;
            color: #fff;
            padding: 20px;
        }

        .sidebar h2 {
            text-align: center;
            margin-bottom: 30px;
        }

        .sidebar nav a {
            display: block;
            color: #ccc;
            padding: 10px;
            text-decoration: none;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .sidebar nav a:hover {
            background: #333;
            color: #fff;
        }

        .main {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .topbar {
            background: #fff;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #ddd;
        }

        .cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 20px;
        }

        .card {
            background: #fff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .card h3 {
            margin-bottom: 10px;
            color: #333;
        }
            .search input {
            padding: 10px;
            width: 400px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
            .profile-picture{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            margin-left: 15px;
            background-color: #ccc;
            text-align: center;
            justify-content: center;
            align-items: center;
            display: flex;
            }
            .profile h4 {
            color: green;
            }
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
                <div class="notifications">
                    <h4>Notifications</h4>
                    <ul>
                        <li>No new notifications</li>
                    </ul>
                </div>
                <div class="profile">
                    <div class="profile-picture">👤</div>
                    <h4>${user.firstName} ${user.lastName}</h4>
                </div>
            </header>

            <section class="cards">
                <div class="card">
                    <h3>Visitors</h3>
                    <p>2,430</p>
                </div>
                <div class="card">
                    <h3>Sales</h3>
                    <p>$1,200</p>
                </div>
                <div class="card">
                    <h3>Orders</h3>
                    <p>320</p>
                </div>
            </section>
        </main>
    </div>
            `
        );
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Internal server error');
    }
});




module.exports = router