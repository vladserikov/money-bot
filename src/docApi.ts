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
