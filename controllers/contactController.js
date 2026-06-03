const emailjs = require('@emailjs/nodejs');

const serviceID = process.env.EMAILJS_SERVICE_ID;
const templateID = process.env.EMAILJS_TEMPLATE_ID;
const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const privateKey = process.env.EMAILJS_PRIVATE_KEY;
const toEmail = process.env.CONTACT_TO_EMAIL || 'snehagade76@gmail.com';

// ✅ Log env vars at startup (masks sensitive values)
console.log('EmailJS Config Check:', {
  serviceID: serviceID ? `✅ ${serviceID}` : '❌ MISSING',
  templateID: templateID ? `✅ ${templateID}` : '❌ MISSING',
  publicKey: publicKey ? '✅ SET' : '❌ MISSING',
  privateKey: privateKey ? '✅ SET' : '❌ MISSING',
  toEmail,
});

if (publicKey && privateKey) {
  emailjs.init({ publicKey, privateKey });
} else {
  console.error('❌ EmailJS not initialized — missing keys');
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sendContactMail = async (req, res) => {
  console.log('--- /api/contact hit ---');
  console.log('Body:', req.body);

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    console.log('❌ Validation failed: missing fields');
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  if (!EMAIL_REGEX.test(email)) {
    console.log('❌ Validation failed: bad email format');
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  if (!serviceID || !templateID || !publicKey || !privateKey) {
    console.log('❌ Missing env variables');
    return res.status(500).json({ message: 'Email service is not configured.' });
  }

  const templateParams = {
    to_email: toEmail,
    from_name: name,
    from_email: email,
    subject: `Classic Bakery contact message from ${name}`,
    message,
  };

  try {
    console.log('📤 Sending email via EmailJS...');
    const response = await emailjs.send(serviceID, templateID, templateParams);
    console.log('✅ Email sent:', response.status, response.text);
    return res.status(200).json({ message: 'Message sent successfully.' });
  } catch (err) {
    // ✅ Log the full error object
    console.error('❌ EmailJS send failed:');
    console.error('  Status:', err?.status);
    console.error('  Text:', err?.text);
    console.error('  Message:', err?.message);
    console.error('  Full error:', JSON.stringify(err, null, 2));

    return res.status(500).json({
      message: 'Failed to send message. Please try again later.',
      // ✅ Expose error detail in dev only
      ...(process.env.NODE_ENV !== 'production' && { debug: err?.text || err?.message }),
    });
  }
};

module.exports = { sendContactMail };