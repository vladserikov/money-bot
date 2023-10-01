import { GoogleSpreadsheet } from 'google-spreadsheet';
import authentication from './authentication';
import { spreadsheetId } from './config';
import { getCategory } from './utils';

const doc = new GoogleSpreadsheet(spreadsheetId, authentication);

export const getSheetByIndex = async (index = 0) => {
    await doc.loadInfo();
    return doc.sheetsByIndex[index];
};

export const getSheetByMonth = async () => {
    await doc.loadInfo();
    const currentMonth = new Date().toLocaleDateString('ru-RU', { month: 'long' });
    const sheet = doc.sheetsByTitle[currentMonth];
    if (sheet) {
        return sheet;
    } else {
        const newSheet = await doc.addSheet();
        await newSheet.updateProperties({ title: currentMonth });
        return newSheet;
    }
};

export const getSheetByTitle = async (title: string) => {
    await doc.loadInfo();
    return doc.sheetsByTitle[title];
};

export const getRows = async () => {
    const sheet = await getSheetByIndex();
    const rows = await sheet.getRows();
    return rows;
};

export const getDayResult = async () => {
    const sheet = await getSheetByMonth();
    const rows = await sheet.getRows();
    let lastRow = rows[rows.length - 1];
    if (!lastRow) return { message: 'error' };
    const categories = await getCategory();

    const date = lastRow.get(categories[0]);

    let result = 0;

    for (let i = 1; i < categories.length; i++) {
        const categoryValue = lastRow.get(categories[i]);
        console.log(categories[i], categoryValue);
        result += categoryValue ? Number(categoryValue) : 0;
    }

    return { lastDate: date, result, message: 'success' };
};

export const updateCell = async (columnName: string, newValue: string) => {
    const sheet = await getSheetByMonth();

    const currentDate = new Date().toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });

    const rows = await sheet.getRows();
    let lastRow = rows[rows.length - 1];

    if (currentDate === lastRow?.get('Категория')) {
        const cellValue = lastRow.get(columnName);
        let currentValue;
        if (cellValue && Number(cellValue) > 0) {
            currentValue = cellValue ? `${Number(cellValue) + Number(newValue)}` : newValue;
        } else {
            currentValue = newValue;
        }
        lastRow.set(columnName, currentValue);
        await lastRow.save();

        return { currentValue, newValue };
    } else {
        const newRow: Record<string, any> = {};
        newRow['Категория'] = currentDate;
        newRow[columnName] = newValue;
        await sheet.addRow(newRow);

        return { currentValue: newValue, newValue };
    }
};

export default doc;
