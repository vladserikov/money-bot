require('dotenv').config();
import { Telegraf, Markup } from 'telegraf';
import { google } from 'googleapis';
import credentials from './budget-bot-396806-ae201ac5d68f.json';
import { InlineKeyboardButton, InlineKeyboardMarkup } from 'telegraf/typings/core/types/typegram';
const sheets = google.sheets('v4');
// ID вашей таблицы
const spreadsheetId = '1jKBMJOg1UMIvOG1Toiw95S8nsEkq8HNzm9eJdeDBVSA';

const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

type ButtonCategory = {
    text: string;
    action: string;
};
let mainKeyboard: ButtonCategory[][];

const token = process.env.BOT_TOKEN as string;

const bot = new Telegraf(token);

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

const getButtonsCategory = async () => {
    const values = await getCategory();
    let listButtons: ButtonCategory[][] = [];
    let resultButtons: ButtonCategory[] = [];

    const countRows = Math.ceil((values.length - 1) / 3);

    for (let i = 0, k = 1; i < countRows; i++) {
        const rowButton: ButtonCategory[] = [];
        for (let j = 0; j < 3; j++, k++) {
            if (!values[k]) break;
            rowButton.push({ action: `add_category_${k}`, text: values[k] });
        }
        listButtons.push(rowButton);
    }

    return listButtons;
};

const createButtons = (buttons: ButtonCategory[][]) => {
    return buttons.map((k) => {
        return k.map((r) => {
            return Markup.button.callback(r.text, r.action);
        });
    });
};

bot.command('start', async (ctx) => {
    mainKeyboard = await getButtonsCategory();
    const buttons = createButtons(mainKeyboard);
    const testKey = Markup.inlineKeyboard(buttons);
    await ctx.reply('Посчитаем денюжку', testKey);
});

bot.action(/add_category_\d+$/, async (ctx) => {
    console.log(ctx);
    const buttons = createButtons(mainKeyboard);
    const testKey = Markup.inlineKeyboard(buttons);

    await ctx.editMessageText(`Редактировать категорию ${ctx.match[0]}`, testKey);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
