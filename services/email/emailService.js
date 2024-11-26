import transporter from './transporter.js';
import registrationTemplate from './templates/registrationTemplate.js';
import passwordResetTemplate from './templates/passwordResetTemplate.js';
import contactTemplate from './templates/contactTemplate.js';

export const sendRegistrationEmail = async (email, username, password) => {
  try {
    const mailOptions = {
      from: `"Polgen Registration" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Polgen',
      html: registrationTemplate(username, email, password),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Registration email sent to ${email}`);
  } catch (error) {
    console.error('Error sending registration email:', error.message);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: `"Polgen Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset',
      html: passwordResetTemplate(resetLink),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    throw error;
  }
};

export const sendContactEmail = async (name, userEmail, message) => {
  try {
    const mailOptions = {
      from: `"${name}" <${userEmail}>`,
      to: process.env.SMTP_USER,
      subject: 'Contact Form Submission',
      html: contactTemplate(name, userEmail, message),
    };
    await transporter.sendMail(mailOptions);
    console.log(`Contact form email sent from ${userEmail}`);
  } catch (error) {
    console.error('Error sending contact email:', error.message);
    throw error;
  }
};

