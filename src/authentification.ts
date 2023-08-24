import { google } from 'googleapis';
import credentials from './budget-bot-396806-ae201ac5d68f.json';

export default new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
