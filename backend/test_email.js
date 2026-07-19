const nodemailer = require("nodemailer");
require("dotenv").config();

const senderEmail = process.env.SMTP_SENDER || "azmigithub@gmail.com";

console.log("Config:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  sender: senderEmail,
  pass: process.env.SMTP_PASS ? "configured" : "missing"
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", 
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

const mailOptions = {
  from: `"Bank Sampah Bakti Alam" <${senderEmail}>`,
  to: senderEmail, // Kirim ke email asli penerima
  subject: "SMTP Test Mail",
  text: "Hello, ini adalah email uji coba dari sistem Bank Sampah Bakti Alam dengan kredensial SMTP Brevo yang diperbarui.",
};

transporter.sendMail(mailOptions)
  .then(info => {
    console.log("✅ Email sent successfully!");
    console.log("Response:", info.response);
    console.log("Message ID:", info.messageId);
  })
  .catch(err => {
    console.error("❌ Error sending email:", err);
  });
