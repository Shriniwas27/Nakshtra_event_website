import sheets from '../config/googlesheetconfig.js';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();


const writeToSheet = async (data) => {
    try {
        const response =  await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: 'Sheet1!A1',
            valueInputOption: 'RAW',
            resource: { values: data }
        });
        console.log('Data written to Google Sheets:', response.data);
    } catch (error) {
        console.error('Error writing to Google Sheets:', error);
    }
};

export default writeToSheet;