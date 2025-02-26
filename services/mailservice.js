import transporter from "../config/nodemailerconfig.js";
import dotenv from "dotenv";
dotenv.config();    

const sendMail = async (to, subject, text) => {
    try {
        await transporter.sendMail({
            from:process.env.EMAIL_ID,
            to: to,
            subject,
            text
        });
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendMail;