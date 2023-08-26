"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const telegraf_1 = require("telegraf");
const utils_1 = require("./utils");
const filters_1 = require("telegraf/filters");
const docApi_1 = require("./docApi");
const config_1 = require("./config");
let mainKeyboard;
let listCategories = [];
const initButtons = async () => {
    const { categories, listButtons } = await (0, utils_1.getButtonsCategory)();
    mainKeyboard = listButtons;
    listCategories = categories;
};
const bot = new telegraf_1.Telegraf(config_1.token);
bot.command('start', async (ctx) => {
    await initButtons();
    const buttons = (0, utils_1.createButtons)(mainKeyboard);
    await ctx.reply('Посчитаем денюжку', telegraf_1.Markup.inlineKeyboard(buttons));
});
bot.command('new_category', async (ctx) => {
    const currentHeaders = await (0, utils_1.getCategory)();
    const sheet = await (0, docApi_1.getSheet)();
    const nameNewCategory = ctx.message.text.slice(14);
    const newCategoryList = currentHeaders.concat(nameNewCategory);
    await sheet.setHeaderRow(newCategoryList);
    await initButtons();
    const buttons = (0, utils_1.createButtons)(mainKeyboard);
    await ctx.reply('Выбирете категорию', telegraf_1.Markup.inlineKeyboard(buttons));
});
bot.action(/expense_(\d+)$/, async (ctx) => {
    if (!mainKeyboard) {
        await initButtons();
    }
    const buttons = (0, utils_1.createButtons)(mainKeyboard);
    const numberCategory = Number(ctx.match[1]);
    const categoryName = listCategories[numberCategory] ?? 'Не верно выбрана категория';
    const buttonCategory = (0, utils_1.getLetterByNumber)(numberCategory);
    await ctx.editMessageText(`Категория: ${categoryName}\nЯчейка: ${buttonCategory}\nОтветом на сообщение введите сумму`, telegraf_1.Markup.inlineKeyboard(buttons));
});
bot.on((0, filters_1.message)('reply_to_message'), async (ctx) => {
    const category = ctx.message.reply_to_message.text;
    const buttons = (0, utils_1.createButtons)(mainKeyboard);
    const test = category
        .split(/Категория:|Ячейка:|\n/)
        .filter((v) => v)
        .map((v) => v.trim());
    const currentColumn = test[0];
    const value = ctx.message.text;
    const { currentValue, newValue } = await (0, docApi_1.updateCell)(currentColumn, value);
    ctx.reply(`Вы ввели ${newValue}\nТекущее значение ${currentValue}\n${category}`, telegraf_1.Markup.inlineKeyboard(buttons));
});
bot.hears('Бюджет', async (ctx) => {
    await initButtons();
    const buttons = (0, utils_1.createButtons)(mainKeyboard);
    await ctx.reply('Посчитаем денюжку', telegraf_1.Markup.inlineKeyboard(buttons));
});
bot.hears('События', async (ctx) => {
    await ctx.reply('Пока что умеем только денюжку считать', telegraf_1.Markup.keyboard([['Бюджет']]).resize());
});
bot.hears('Ссылки', async (ctx) => {
    await ctx.reply('Пока что умеем только денюжку считать', telegraf_1.Markup.keyboard([['Бюджет']]).resize());
});
bot.on((0, filters_1.message)('text'), async (ctx) => {
    ctx.reply('Выберите действие', telegraf_1.Markup.keyboard([['Бюджет', 'События'], ['Ссылки']]).resize());
});
bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
