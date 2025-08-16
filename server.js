const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Serve static files like CSS, images, favicon
app.use(express.static(path.join(__dirname, 'public')));

// Parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve HTML pages from the views folder
const servePage = (page) => (req, res) =>
  res.sendFile(path.join(__dirname, 'views', `${page}.html`));

app.get('/', servePage('index'));
app.get('/contact', servePage('contact'));
// Add other pages like /cleaning, /windows, etc.

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

  // Email content
  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New message from ${name}`,
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    res.send('Message sent successfully!');
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).send('Failed to send message.');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));