const nodemailer = require('nodemailer');

const sendContactMail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT) || 587;
  const secure = process.env.EMAIL_SECURE === 'true';
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to = process.env.EMAIL_TO || user;

  if (!host || !user || !pass || !to) {
    return res.status(500).json({
      message:
        'Email server is not configured. Please set EMAIL_HOST, EMAIL_USER, EMAIL_PASS, and EMAIL_TO in .env.',
    });
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
    connectionTimeout: 10000,  // ✅ ADD
    greetingTimeout: 10000,    // ✅ ADD
    socketTimeout: 15000,      // ✅ ADD
  });

  const mailOptions = {
    from: `"Classic Bakery" <${user}>`,
    replyTo: `${name} <${email}>`,
    to,
    subject: `Classic Bakery contact message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`,
  };

  console.log('Contact form request received:', { name, email, message, to });

  try {
    await transporter.verify();
    const info = await transporter.sendMail(mailOptions);
    console.log('Contact email sent:', info.response || info.messageId);
    res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    console.error('Contact email error:', err);
    const errorMessage = err.response?.body || err.message || 'Unable to send message. Please try again later.';
    res.status(500).json({ message: `Unable to send message. ${errorMessage}` });
  }
};

module.exports = { sendContactMail };