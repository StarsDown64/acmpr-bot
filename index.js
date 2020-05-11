/*
 * This bot was made by following the discord.js v12.x guide
 * Credit to the discord.js team and any other contributors to the guide
 * 
 * Functionality:
 * help: A dynamic help command that can list all commands or list info on a specific command
 * massdm: DMs all users in a guild with a certain role
 * process: Removes New Member role and DMs mentioned users if they meet requirements
 * prune: Deletes 1-99 messages in a channel
 * final-alert: Gives all New Members with 48+ hours of server time the removeme role and sends a message in #final-alert every 24 hours
 * commandFlags: Listed in ./config.json
*/

// @requires
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const { prefix, token } = require('./config.json');

// Start new client
const client = new Discord.Client();

// Discover commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// Once bot start
client.once('ready', () => {
    console.log('Bot Ready\nDate: ' + new Date(Date.now()).toString());
    setInterval(function () {
        client.guilds.resolve('[REDACTED] ACMPR').roles.resolve('[REDACTED] @New Member').members.forEach(member => {
            setTimeout(function () {
                if (member.joinedAt + 172800000 < Date.now()) { member.roles.add('[REDACTED] @removeme'); }
            }, 500);
        });
        client.guilds.resolve('[REDACTED] ACMPR').channels.resolve('[REDACTED] #final-alert').send('[REDACTED] @removeme you have not completed your registrations and your accounts are marked for deletion.\nPlease complete the registration process to avoid being kicked.\nIf you have any questions regarding this, please post them in <#461723073427800094>');
    }, 86400000);
});

// On message received
client.on('message', message => {
    // Return if message is from bot or doesn't start with prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Set up args
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log('Message: ' + message.content + '\nAuthor: ' + message.author.tag + '\nChannel: ' + message.channel.name);
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    
    // Check for guildOnly flag
    if (command.guildOnly && message.channel.type !== 'text' && message.author.id !== '[REDACTED] StarsDown64#1328') { return message.reply('I can\'t execute that command inside DMs!'); }
    
    // Check for roleOnly flag
    if (command.roleOnly && message.author.id !== '[REDACTED] StarsDown64#1328') {
        let flag = false;
        for (const roleId of command.roleOnly) { if (message.member.roles.cache.has(roleId)) { flag = true; } }
        if (!flag) { return message.reply('you don\'t have permission to execute that command.'); }
    }

    // Check for permissions flag
    if (command.permissions && message.author.id !== '[REDACTED] StarsDown64#1328') {
        let flag = false;
        for (const permissionName of command.permissions) { if (message.member.hasPermission(permissionName)) { flag = true; } }
        if (!flag) { return message.reply('you don\'t have the permissions necessary to execute that command.'); }
    }

    // Check for args flag
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;
        if (command.usage) { reply += `\nThe proper usage is: \`${prefix}${command.name} ${command.usage}\``; }
        return message.channel.send(reply);
    }

    // Check for cooldown flag
    if (!cooldowns.has(command.name)) { cooldowns.set(command.name, new Discord.Collection()); }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || config.defaultCooldownTime) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime && message.author.id !== '[REDACTED] StarsDown64#1328') {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    } else {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    // Execute command
    try { command.execute(message, args); }
    catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command');
    }
});

// Login
client.login(token);