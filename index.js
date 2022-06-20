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

const client = new Client();

client.on('qr', qr => {
   qrcode.generate(qr, {small: true});
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
    console.log('join', notification);
    notification.reply(data.toString());
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

        }
    } catch (e) {
            
    }
});

client.initialize();