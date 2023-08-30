require('dotenv').config();
import { Telegraf, Markup } from 'telegraf';
import { ButtonCategory, createButtons, getButtonsCategory, getCategory, getLetterByNumber } from './utils';
import { message } from 'telegraf/filters';
import { getSheet, updateCell } from './docApi';
import { token } from './config';

let mainKeyboard: ButtonCategory[][];
let listCategories: string[] = [];

const initButtons = async () => {
    const { categories, listButtons } = await getButtonsCategory();
    mainKeyboard = listButtons;
    listCategories = categories;
};

const bot = new Telegraf(token);

bot.command('start', async (ctx) => {
    await initButtons();
    const buttons = createButtons(mainKeyboard);
    await ctx.reply('Посчитаем денюжку', Markup.inlineKeyboard(buttons));
});

bot.command('new_category', async (ctx) => {
    const currentHeaders = await getCategory();
    const sheet = await getSheet();
    const nameNewCategory = ctx.message.text.slice(14);
    const newCategoryList = currentHeaders.concat(nameNewCategory);

    await sheet.setHeaderRow(newCategoryList);

    await initButtons();
    const buttons = createButtons(mainKeyboard);

    await ctx.reply('Выбирете категорию', Markup.inlineKeyboard(buttons));
});

bot.action(/expense_(\d+)$/, async (ctx) => {
    if (!mainKeyboard) {
        await initButtons();
    }
    const buttons = createButtons(mainKeyboard);
    const numberCategory = Number(ctx.match[1]);
    const categoryName = listCategories[numberCategory] ?? 'Не верно выбрана категория';
    const buttonCategory = getLetterByNumber(numberCategory);

    await ctx.editMessageText(
        `Категория: ${categoryName}\nЯчейка: ${buttonCategory}\nОтветом на сообщение введите сумму`,
        Markup.inlineKeyboard(buttons),
    );
});

bot.on(message('reply_to_message'), async (ctx) => {
    if (!mainKeyboard) {
        await initButtons();
    }
    const category = (ctx.message.reply_to_message as { text: string }).text;
    const buttons = createButtons(mainKeyboard);

    const regex = /Категория:\s(.*?)\s|Ячейка:\s(.*?)\s/g;

    let match,
        categoryChar,
        categoryName = '';
    while ((match = regex.exec(category)) !== null) {
        if (match[1]) {
            categoryName = match[1];
        }
        if (match[2]) {
            categoryChar = match[2];
        }
    }

    const value = (ctx.message as { text: string }).text;

    const { currentValue, newValue } = await updateCell(categoryName, value);
    const endMessage = `Категория: ${categoryName}\nЯчейка: ${categoryChar}\nОтветом на сообщение введите сумму`;

    ctx.reply(`Вы ввели ${newValue}\nТекущее значение ${currentValue}\n${endMessage}`, Markup.inlineKeyboard(buttons));
});

bot.hears('Бюджет', async (ctx) => {
    await initButtons();
    const buttons = createButtons(mainKeyboard);
    await ctx.reply('Посчитаем денюжку', Markup.inlineKeyboard(buttons));
});

bot.hears('События', async (ctx) => {
    await ctx.reply('Пока что умеем только денюжку считать', Markup.keyboard([['Бюджет']]).resize());
});

bot.hears('Ссылки', async (ctx) => {
    await ctx.reply('Пока что умеем только денюжку считать', Markup.keyboard([['Бюджет']]).resize());
});

bot.on(message('text'), async (ctx) => {
    ctx.reply('Выберите действие', Markup.keyboard([['Бюджет', 'События'], ['Ссылки']]).resize());
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
