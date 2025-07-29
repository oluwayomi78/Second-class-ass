require('dotenv').config(); // Load environment variables early

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const userRoute = require("./routes/user.route");
const userModel = require("./models/user.model"); // ✅ Ensure this file exists and exports userModel
const userSchema = require("./models/user.model").userSchema; // ✅ If you exported schema separately
const path = require('path'); // ✅ Import path for serving static files
const router = express.Router();

// Constants
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.mongodb_uri;

let info = ""; // placeholder to avoid undefined error in EJS

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.use("/user", userRoute);
router.get('/signup', userController.fetchData);
router.get('/login', userController.loginPage);

// Fetch data for EJS view (async load at startup)
fetch('https://students-api-woad.vercel.app/api')
    .then(response => response.json())
    .then(data => {
        info = data.message || "No info received";
    })
    .catch(error => {
        console.log('Error fetching data:', error.message);
    });

const connection = mongoose.connect(MONGO_URI)
connection.then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    });

// EJS route
app.get("/ejs", (req, res) => {
    const score = 19;
    res.render("index", {
        date: new Date().toLocaleString(),
        info,
        score,
        userModel,
        userSchema
    });
});

// Form submission route
app.post('/submit', async (req, res) => {
    console.log('Form submitted');
    try {
        const user = new userModel(req.body);
        await user.save();
        res.status(200).json({ message: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Nodemailer route
app.post('/send-mail', async (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ message: 'Recipient email (to) is required' });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,   // ✅ Put in .env
            pass: process.env.EMAIL_PASS    // ✅ App-specific password in .env
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: '🛍️ Weekend Super Sale at City Mall!',
        text: 'Don’t miss out on amazing deals at City Mall this weekend!',
        html: `<p>🛍️ Weekend Super Sale at City Mall! Don't miss out!</p>` // Keep your HTML content here (already looks fine)
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('❌ Error sending mail:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});

// Optional home route
app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
