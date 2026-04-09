import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend-ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name){
  const subject = 'Welcome to Backend-ledger!';
  const text = `Hi ${name},\n\nThank you for registering with Backend-ledger! We're excited to have you on board.\n\nBest regards,\nThe Backend-ledger Team`;
  const html = `<p>Hi ${name},</p><p>Thank you for registering with Backend-ledger! We're excited to have you on board.</p><p>Best regards,<br>The Backend-ledger Team</p>`;
  
  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmailToSender(userEmail, name, amount, recipientName, currency){
  const subject = 'Transaction Notification from Backend-ledger';
  const text = `Hi ${name},\n\nYou have successfully transferred ${currency} ${amount} to ${recipientName} using Backend-ledger.\n\nBest regards,\nThe Backend-ledger Team`;
  const html = `<p>Hi ${name},</p><p>You have successfully transferred ${currency} ${amount} to ${recipientName} using Backend-ledger.</p><p>Best regards,<br>The Backend-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmailToRecipient(userEmail, name, amount, senderName, currency){
  const subject = 'Transaction Notification from Backend-ledger';
  const text = `Hi ${name},\n\nYou have received ${currency} ${amount} from ${senderName} using Backend-ledger.\n\nBest regards,\nThe Backend-ledger Team`;
  const html = `<p>Hi ${name},</p><p>You have received ${currency} ${amount} from ${senderName} using Backend-ledger.</p><p>Best regards,<br>The Backend-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, recipientName, currency){
  const subject = 'Transaction Failure Notification from Backend-ledger';
  const text = `Hi ${name},\n\nWe regret to inform you that your attempt to transfer ${currency} ${amount} to ${recipientName} using Backend-ledger was unsuccessful. Please check your account balance and try again.\n\nBest regards,\nThe Backend-ledger Team`;
  const html = `<p>Hi ${name},</p><p>We regret to inform you that your attempt to transfer ${currency} ${amount} to ${recipientName} using Backend-ledger was unsuccessful. Please check your account balance and try again.</p><p>Best regards,<br>The Backend-ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

export { sendRegistrationEmail, sendTransactionEmailToSender, sendTransactionEmailToRecipient, sendTransactionFailureEmail };