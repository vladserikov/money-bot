"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCell = exports.getRows = exports.getSheet = void 0;
const google_spreadsheet_1 = require("google-spreadsheet");
const authentication_1 = __importDefault(require("./authentication"));
const config_1 = require("./config");
const doc = new google_spreadsheet_1.GoogleSpreadsheet(config_1.spreadsheetId, authentication_1.default);
const getSheet = async (index = 0) => {
    await doc.loadInfo();
    return doc.sheetsByIndex[index];
};
exports.getSheet = getSheet;
const getRows = async () => {
    const sheet = await (0, exports.getSheet)();
    const rows = await sheet.getRows();
    return rows;
};
exports.getRows = getRows;
const updateCell = async (columnName, newValue) => {
    const sheet = await (0, exports.getSheet)();
    const currentDate = new Date().toLocaleDateString();
    const rows = await sheet.getRows();
    let lastRow = rows[rows.length - 1];
    const cellValue = lastRow.get(columnName);
    const currentValue = cellValue ? `${Number(cellValue) + Number(newValue)}` : newValue;
    if (currentDate === lastRow?.get('Категория')) {
        lastRow.set(columnName, currentValue);
        await lastRow.save();
    }
    else {
        const newRow = {};
        newRow['Категория'] = currentDate;
        newRow[columnName] = currentValue;
        await sheet.addRow(newRow);
    }
    return { currentValue, newValue };
};
exports.updateCell = updateCell;
exports.default = doc;
