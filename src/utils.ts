import auth from './authentification';
import sheets from './sheetsApi';

const spreadsheetId = '1jKBMJOg1UMIvOG1Toiw95S8nsEkq8HNzm9eJdeDBVSA';

export type ButtonCategory = {
    text: string;
    action: string;
};

const getCategory = async () => {
    const range = 'Лист1!A1:Z1'; // Замените на желаемый диапазон.

    try {
        const response = await sheets.spreadsheets.values.get({
            auth,
            spreadsheetId,
            range,
        });
        const values = response.data.values as string[][];
        return values[0];
    } catch (error) {
        console.error(error);
    }
    return [];
};

export const getButtonsCategory = async () => {
    const values = await getCategory();
    let listButtons: ButtonCategory[][] = [];
    const keyboardLength = 3;
    const startColumn = 1;
    const countRows = Math.ceil((values.length - startColumn) / keyboardLength);

    for (let i = 0, k = startColumn; i < countRows; i++) {
        const rowButton: ButtonCategory[] = [];
        for (let j = 0; j < keyboardLength; j++, k++) {
            if (!values[k]) break;
            rowButton.push({ action: `add_category_${k}`, text: values[k] });
        }
        listButtons.push(rowButton);
    }

    return { listButtons, categories: values };
};
