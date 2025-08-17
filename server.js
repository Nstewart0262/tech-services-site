// import required modules
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

// create express app
const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve HTML pages from the views folder
const servePage = (pageName) => (req, res) => {
  res.sendFile(path.join(__dirname, 'views', `${pageName}.html`));
};

// routes for each page
app.get('/', servePage('index'));
app.get('/cleaning', servePage('cleaning'));
app.get('/windows', servePage('windows'));
app.get('/upgrades', servePage('upgrades'));
app.get('/antivirus', servePage('antivirus'));
app.get('/sales', servePage('sales'));
app.get('/mail-in', servePage('mail-in'));
app.get('/contact', servePage('contact'));

// contact form POST route (optional)
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Create a transporter object using Gmail
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: 'New message from ${name}',
      text: message
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send message.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));