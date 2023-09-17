import { JWT } from 'google-auth-library';
import { aouth } from './config';

const buffer = Buffer.from(aouth, 'base64');

export const credentials = JSON.parse(buffer.toString('ascii'));

export default new JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
