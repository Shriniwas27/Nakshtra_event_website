import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_SERVICE_KEY, // Store the path in .env
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});


const sheets= google.sheets({version: 'v4', auth});

export default sheets;
