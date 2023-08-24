require('dotenv').config();
import { Telegraf, Markup } from 'telegraf';
import { ButtonCategory, getButtonsCategory } from './utils';
// ID вашей таблицы

let mainKeyboard: ButtonCategory[][];
let listCategories: string[] = [];

const token = process.env.BOT_TOKEN as string;

const bot = new Telegraf(token);

const createButtons = (buttons: ButtonCategory[][]) => {
    return buttons.map((k) => {
        return k.map((r) => {
            return Markup.button.callback(r.text, r.action);
        });
    });
};

bot.command('start', async (ctx) => {
    const { categories, listButtons } = await getButtonsCategory();
    mainKeyboard = listButtons;
    listCategories = categories;
    const buttons = createButtons(mainKeyboard);
    const testKey = Markup.inlineKeyboard(buttons);
    await ctx.reply('Посчитаем денюжку', testKey);
});

bot.action(/add_category_\d+$/, async (ctx) => {
    console.log(ctx);
    const buttons = createButtons(mainKeyboard);
    const testKey = Markup.inlineKeyboard(buttons);
    // const categoryName =

    await ctx.editMessageText(`Редактировать категорию ${ctx.match[0]}`, testKey);
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
