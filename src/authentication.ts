import { JWT } from 'google-auth-library';
import fs from 'fs';

const pathToJson = './budget-bot-396806-ae201ac5d68f.json';
const rawData = fs.readFileSync(pathToJson, 'utf-8');
export const credentials = JSON.parse(rawData);

export default new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
