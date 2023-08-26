"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = exports.spreadsheetId = void 0;
require('dotenv').config();
exports.spreadsheetId = process.env.SHEET_ID;
exports.token = process.env.BOT_TOKEN;
