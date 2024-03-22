import { Telegraf } from 'telegraf';
import express from "express";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import yts from 'yt-search';
import ytdl from 'ytdl-core';
import axios from 'axios'


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const bot = new Telegraf('6863765930:AAFa9-D5wwOhL1n4klpe3Bgyih7ArqrnCF4');


bot.start((ctx) => {
ctx.replyWithPhoto(
'https://i.pinimg.com/originals/65/dc/e7/65dce70d757e6fd45807ce1f7bc47802.jpg',
{
caption: `Selamat datang, ${ctx.from.first_name}!

𝗛𝗮𝗹𝗹𝗼 𝗸𝗮𝗸, 𝗠𝗮𝗮𝗳 𝗝𝗶𝗸𝗮 𝗣𝗲𝗹𝗮𝘆𝗮𝗻𝗮𝗻 𝗕𝗼𝘁 𝗕𝗮𝗻𝘆𝗮𝗸 𝗞𝗲𝗸𝘂𝗿𝗮𝗻𝗴𝗮𝗻𝗻𝘆𝗮 𝗞𝗮𝗿𝗻𝗮 𝗕𝗼𝘁 𝗜𝗻𝗶 𝗠𝗮𝘀𝗶𝗵 𝗩𝗲𝗿𝘀𝗶 1.0.0 (𝗕𝗘𝗧𝗔)`,
parse_mode: 'Markdown',
reply_markup: {
inline_keyboard: [
[
{text: 'SIESTA - MD WhatsApp Version', url: 'https://wa.me/6281268248904'},
],
[
{text: 'WhatsApp Group', url: 'https://chat.whatsapp.com/G6W25LQb4Ce2i8r4Z0du1q'}
],
[
{text: 'OPEN MENU', callback_data: 'menu'}
]
]
}
}
);
});

//Menu Button
bot.action('menu', (ctx) => {
const audioPath = join(__dirname, 'src/audio.mp3');
ctx.deleteMessage().catch(() => {});
ctx.replyWithPhoto(
'https://telegra.ph/file/e679df0535ef640cc8b8c.jpg',
{
caption: `
╾────𝙇𝙞𝙨𝙩 • 𝙈𝙚𝙣𝙪────╼
╾───────────────╼
➣ /play
➣ /play
╾───────────────╼ 
`,
reply_markup: {
inline_keyboard: [
[
{text: 'WhatsApp Group', url: 'https://chat.whatsapp.com/G6W25LQb4Ce2i8r4Z0du1q'}
]
]
}
}
).then(() => {
return ctx.replyWithAudio(
{ source: fs.createReadStream(audioPath), filename: '—Satzz Takeshi.' }
);
}).then(() => ctx.deleteMessage()).catch((err) => console.log(err))
});


//wellcome
bot.on('new_chat_members', (ctx) => {
const newUser = ctx.message.new_chat_member;
ctx.replyWithPhoto(
'https://telegra.ph/file/f89890cc5f9f0f5098f22.jpg',
{
caption: `Halo ${newUser.first_name}, selamat datang di ${ctx.chat.title}! Jangan lupa baca deskripsi ya.`,
parse_mode: 'Markdown',
reply_markup: {
inline_keyboard: [
[
{text: 'SIESTA - MD WhatsApp Version', url: 'https://wa.me/6281268248904'},
],
[
{text: 'WhatsApp Group', url: 'https://chat.whatsapp.com/G6W25LQb4Ce2i8r4Z0du1q'}
]
]
}
}
);
}); 


//leave
bot.on('left_chat_member', (ctx) => {
const leftUser = ctx.message.left_chat_member;
bot.telegram.sendPhoto(
leftUser.id,
'https://telegra.ph/file/85d17018c69db96f618b7.jpg',
{
caption: `Jangan lupain kita ya, ${leftUser.first_name}. Nanti kalo mau join lagi, klik tombol di bawah ini.`,
parse_mode: 'Markdown',
reply_markup: {
inline_keyboard: [
[
{text: 'SIESTA - MD WhatsApp Version', url: 'https://wa.me/6281268248904'},
],
[
{text: 'WhatsApp Group', url: 'https://chat.whatsapp.com/G6W25LQb4Ce2i8r4Z0du1q'}
]
]
}
}
);
});



bot.on('message', async (ctx) => {   
console.log(ctx.message)
const body = ctx.message.text ? ctx.message.text : ctx.message.caption ? ctx.message.caption : '';
const isCmd = body.startsWith('/');
const command = body.replace("/", "").trim().split(/ +/).shift().toLowerCase();
const args = body.trim().split(/ +/).slice(1);
const q = args.join(" ").trim();

const reply = async(text) => {
ctx.reply(text, { reply_to_message_id: ctx.message.message_id })
} 



if (isCmd) {
switch (command) {
case 'play': {
if (!q) return reply('input query')
try {
const waitMessage = await reply('Please wait...');
const search = await yts.search(q); 
const videos = search.videos[0];
const audioStream = ytdl(videos.url, { filter: "audioonly" });
audioStream.pipe(fs.createWriteStream('playing.mp3'));
audioStream.on("finish", () => {
ctx.replyWithPhoto(videos.thumbnail, {
caption: videos.desc,
parse_mode: 'Markdown',
reply_markup: {
inline_keyboard: [[{text: 'SIESTA - MD WhatsApp Version', url: 'https://wa.me/6281268248904'}]]}});
ctx.replyWithAudio({source: fs.createReadStream(join(__dirname, 'playing.mp3')),filename: videos.title}).then(async () => {
ctx.deleteMessage(waitMessage.message_id).catch(error => console.error('Error deleting message:', error))
fs.unlinkSync(join(__dirname, 'playing.mp3'));
})
});
} catch (err) {
console.error('Error playing audio:', err);
ctx.reply('Failed to play audio. Please try again later.');
}
}
break;
case 'hd': {
if (!ctx.message || !ctx.message.reply_to_message || !ctx.message.reply_to_message.photo) {
ctx.reply('Reply message is not a photo');
}
const waitMessage = await reply('Please wait...');
const photo = ctx.message.reply_to_message.photo[ctx.message.reply_to_message.photo.length - 1]; 
const imageData = photo.file_id;
const fileResponse = await axios.get(`https://api.telegram.org/bot6863765930:AAFa9-D5wwOhL1n4klpe3Bgyih7ArqrnCF4/getFile?file_id=${imageData}`);
const filePath = fileResponse.data.result.file_path;
const fileUrl = `https://api.telegram.org/file/bot6863765930:AAFa9-D5wwOhL1n4klpe3Bgyih7ArqrnCF4/${filePath}`;
const final = await axios.get(`https://api.satganzdevs.tech/api/remini?url=${fileUrl}`, { responseType: 'arraybuffer' })
await ctx.replyWithPhoto({ source: Buffer.from(final.data), caption: 'nih', reply_to_message_id: ctx.message.message_id }).then(async () => ctx.deleteMessage(waitMessage.message_id))
}
break;
default:
break;
}
}
});;



// routes
app.get("/", (req, res) => {
res.send('Hellow World!')
});
// starting the server
app.listen(3000, () => {
  bot.launch();
  console.log(`Bot IS Connected!`);
});
