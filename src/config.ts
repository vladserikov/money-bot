require('dotenv').config();

export const spreadsheetId = process.env.SHEET_ID as string;
export const token = process.env.BOT_TOKEN as string;
