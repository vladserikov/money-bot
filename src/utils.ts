import { Markup } from 'telegraf';
import { getSheetByMonth } from './docApi';

export type ButtonCategory = {
    text: string;
    action: string;
};

export const getCategory = async () => {
    const sheet = await getSheetByMonth();
    await sheet.loadHeaderRow();
    return sheet.headerValues;
};

export const getButtonsCategory = async () => {
    const categories = await getCategory();
    let listButtons: ButtonCategory[][] = [];
    const keyboardLength = 3;
    const startColumn = 1;
    const countRows = Math.ceil((categories.length - startColumn) / keyboardLength);

    for (let i = 0, k = startColumn; i < countRows; i++) {
        const rowButtons: ButtonCategory[] = [];
        for (let j = 0; j < keyboardLength; j++, k++) {
            if (!categories[k]) break;
            rowButtons.push({ action: `expense_${k}`, text: categories[k] });
        }
        listButtons.push(rowButtons);
    }

    return { listButtons, categories };
};

export const getLetterByNumber = (num: number) => {
    if (num >= 1 && num <= 26) {
        // ASCII код буквы 'A' равен 65
        return String.fromCharCode(65 + num);
    } else {
        return 'Недопустимый номер';
    }
};

export const createButtons = (buttons: ButtonCategory[][]) => {
    return buttons.map((k) => {
        return k.map((r) => {
            return Markup.button.callback(r.text, r.action);
        });
    });
};
