const { Client, LocalAuth, Location, List, Buttons, MessageMedia, NoAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

var fs = require('fs');

var data;
try {  
    data = fs.readFileSync('message.txt', 'utf8');   
} catch(e) {
    console.log('Error:', e.stack);
}

process.on('uncaughtException', err => {
    console.error(err && err.stack)
});

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { executablePath: '/usr/bin/google-chrome-stable', headless: false }
});

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});


client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});


client.on('ready', () => {
    console.log('Client is ready!');
});


client.on('group_join', (notification) => {
    wait()
    async function wait() {
        console.log('join', notification);
        await new Promise(resolve => setTimeout(resolve, 10000));
        notification.reply(data.toString());

        
    }
});

client.on('message', async msg => {
    try {
        if (msg.body.includes("chat.whatsapp")) {

            var helper;
            if (msg.body.includes(" ")){
                helper = msg.body.split(" ")[0];
            } else {
                helper = msg.body
            }

            var InviteCode = helper.split("com/")[1];
            join()
            async function join() {
                try {
                    await client.acceptInvite(InviteCode);
                } catch (e) {
                    
                }
            }

        } else if(msg.body.includes("hidetag")) {
            let chat = await msg.getChat()
            console.log(chat)
            var participants = chat.groupMetadata.participants
            let _participants = participants.map(v => v.id._serialized)
            let mentions = []
            for (let jid of _participants) mentions.push(await client.getChatById(jid))
            if (msg.hasMedia) {
                let message = await quoted.downloadMedia()
                client.sendMessage(msg.from, message, { mentions })
            } else {
                client.sendMessage(msg.from, "hii", { mentions })
            }
        }
    } catch (e) {
        console.log(e.message)
    }
});

client.initialize();