
// import nodemailer from 'nodemailer'

// const email = process.env.NODEMAILER_EMAIL
// const password = process.env.NODEMAILER_PW
// const email2 = "pathfriend@gmail.com"




// export const transporter = nodemailer.createTransport({
//     service: "gmail",
//     host: 'smtp.gmail.com',
//     tls: {
//         ciphers: "SSLv3",
//     },
//     port: 587,
//     secure: false,
//     auth: {
//         user: email,
//         pass: password
//     }
// })

// export const mailOptions = {
//     from: email,
//     to: email2
// }

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // True for 465, false for other ports
    auth: {
        user: process.env.NODEMAILER_EMAIL, // Your email
        pass: process.env.NODEMAILER_PW, // Your email password or app password
    },
});

// Reusable function to send an email
export const sendMail = async ({ to, subject, text, html }) => {
    try {
        const mailOptions = {
            from: process.env.NODEMAILER_EMAIL, // Sender email
            to,
            subject,
            text,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email sending failed:", error);
        return { success: false, error };
    }
};
