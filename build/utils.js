"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createButtons = exports.getLetterByNumber = exports.getButtonsCategory = exports.getCategory = void 0;
const telegraf_1 = require("telegraf");
const docApi_1 = require("./docApi");
const getCategory = async () => {
    const sheet = await (0, docApi_1.getSheet)();
    await sheet.loadHeaderRow();
    return sheet.headerValues;
};
exports.getCategory = getCategory;
const getButtonsCategory = async () => {
    const categories = await (0, exports.getCategory)();
    let listButtons = [];
    const keyboardLength = 3;
    const startColumn = 1;
    const countRows = Math.ceil((categories.length - startColumn) / keyboardLength);
    for (let i = 0, k = startColumn; i < countRows; i++) {
        const rowButtons = [];
        for (let j = 0; j < keyboardLength; j++, k++) {
            if (!categories[k])
                break;
            rowButtons.push({ action: `expense_${k}`, text: categories[k] });
        }
        listButtons.push(rowButtons);
    }
    return { listButtons, categories };
};
exports.getButtonsCategory = getButtonsCategory;
const getLetterByNumber = (num) => {
    if (num >= 1 && num <= 26) {
        return String.fromCharCode(65 + num);
    }
    else {
        return 'Недопустимый номер';
    }
};
exports.getLetterByNumber = getLetterByNumber;
const createButtons = (buttons) => {
    return buttons.map((k) => {
        return k.map((r) => {
            return telegraf_1.Markup.button.callback(r.text, r.action);
        });
    });
};
exports.createButtons = createButtons;
