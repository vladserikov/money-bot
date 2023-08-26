"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.credentials = void 0;
const google_auth_library_1 = require("google-auth-library");
const fs_1 = __importDefault(require("fs"));
const pathToJson = './budget-bot-396806-ae201ac5d68f.json';
const rawData = fs_1.default.readFileSync(pathToJson, 'utf-8');
exports.credentials = JSON.parse(rawData);
exports.default = new google_auth_library_1.JWT({
    email: exports.credentials.client_email,
    key: exports.credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
