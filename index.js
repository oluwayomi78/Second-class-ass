const express = require('express');
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const PORT = 5059;
const HtmlPage = '/'
const uri = "mongodb+srv://preciousenoch459:OkWZLsDXK3x1ILLG@cluster0.rrmgi3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // database name is bcrypt
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const nodemailer = require("nodemailer");
const userRoute = require("./routes/user.route")
// const path = require('path');

app.use("/user", userRoute);


app.listen(PORT, () => {
    console.log('my name is precious')
})

app.set('view engine', 'ejs');
const score = 19;

app.get("/ejs", (req, res) => {
    res.render("index", { date: new Date().toLocaleString(), info, score, userModel, userSchema });
})
fetch('https://students-api-woad.vercel.app/api')
    .then(response => (response.json()))
    .then(response => {
        // console.log(response);
        info = response.message;
    })
    .catch(error => {
        console.log('Error Fetching data', error);
    })

const connection = mongoose.connect(uri)

connection.then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
        console.error('Error connecting to MongoDB', error);
    })




app.post('/submit', (req, res) => {
    console.log('Form submitted');
    try {
        const user = new userModel(req.body);
        console.log(user);
        user.save();
        res.status(200).json({ message: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})




// nodemailer
app.post('/send-mall', async (req, res) => {
    const { to } = req.body;

    if (!to) {
        return res.status(400).json({ message: 'Recipient email (to) is required' });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'preciousenoch459@gmail.com',       // ✅ Your Gmail
            pass: 'jujy ypdt hliu wohl' // App password only     
        }
    });

    // Define email options
    const mailOptions = {
        from: 'preciousenoch459@gmail.com',
        to,
        subject: '🛍️ Weekend Super Sale at City Mall!',
        text: 'Don’t miss out on amazing deals at City Mall this weekend!',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <title>City Mall Promo</title>
        </head>
        <body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
            <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; margin: 20px auto; border-radius: 8px; overflow: hidden;">
                <tr>
                    <td style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
                    <h1 style="margin: 0;">🛍️ City Mall Super Sale</h1>
                    <p style="margin: 5px 0 0;">Up to 70% off this weekend only!</p>
                    </td>
                </tr>
                <tr>
                <td style="padding: 20px;">
                    <h2 style="color: #333333;">Top Deals From Your Favorite Stores</h2>
                    <ul>
                        <li>👗 Zara - 50% off selected items</li>
                        <li>👟 Nike - Buy 1 Get 1 Free</li>
                        <li>📱 TechWorld - Flash Sale on Gadgets</li>
                    </ul>
                    <p>Visit us this weekend (Friday-Sunday) and enjoy amazing discounts, food, music, and entertainment for the whole family!</p>
                    <p style="text-align: center; margin: 30px 0;">
                    <a href="https://www.yourmallwebsite.com" style="background-color: #e74c3c; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">View Offers</a>
                    </p>
                    <p style="color: #777777; font-size: 12px; text-align: center;">
                    City Mall, Main Street, Lagos • +234-800-MALLNOW
                    </p>
                </td>
                </tr>
                <tr>
                    <td style="background-color: #ecf0f1; padding: 10px; text-align: center; font-size: 12px; color: #888888;">
                    You are receiving this email because you subscribed to City Mall updates.
                </td>
                </tr>
                </table>
            </td>
            </tr>
        </table>
        </body>
        </html>
    `
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully', info });
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
});




// app.get(HtmlPage, (req, res)=>{
//     console.log("hello Welcome to Node.js")
//     console.log(__dirname)
//     // res.sendFile(__dirname+"/index.html")
//     res.sendFile(`${__dirname}/index.html`)
// })