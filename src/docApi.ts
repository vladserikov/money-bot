import { GoogleSpreadsheet } from 'google-spreadsheet';
import authentication from './authentication';
import { spreadsheetId } from './config';

const doc = new GoogleSpreadsheet(spreadsheetId, authentication);

export const getSheet = async (index = 0) => {
    await doc.loadInfo();
    return doc.sheetsByIndex[index];
};

export const getRows = async () => {
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    return rows;
};

export const updateCell = async (columnName: string, newValue: string) => {
    const sheet = await getSheet();

    const currentDate = new Date().toLocaleDateString();
    const rows = await sheet.getRows();
    let lastRow = rows[rows.length - 1];

    const cellValue = lastRow.get(columnName);

    const currentValue = cellValue ? `${Number(cellValue) + Number(newValue)}` : newValue;

    if (currentDate === lastRow?.get('Категория')) {
        lastRow.set(columnName, currentValue);
        await lastRow.save();
    } else {
        const newRow: Record<string, any> = {};
        newRow['Категория'] = currentDate;
        newRow[columnName] = currentValue;
        await sheet.addRow(newRow);
    }
    return { currentValue, newValue };
};

export default doc;
