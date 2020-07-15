/*
 * This bot was made by following the discord.js v12.x guide
 * Credit to the discord.js team and any other contributors to the guide
 * Changelog: https://docs.google.com/document/d/1HPG2qYNN0Wrjk3RwdKyRadQ3M34C3RjdqcFjneKCt9M/edit?usp=sharing
 * 
 * Functionality:
 * help: A dynamic help command that can list all commands or list info on a specific command
 * massdm: DMs all users in a guild with a certain role
 * process: Removes New Member role and DMs mentioned users if they meet requirements
 * prune: Deletes 1-99 messages in a channel
 * collectbots: Prints all bots
 * logdump: Dumps the current log file
 * shutdown: Shuts the bot down properly
 * purge: Removes all members with the removeme role
 * final-alert: Gives all New Members with 48+ hours of server time the removeme role and sends a message in #final-alert every 24 hours
 * commandFlags: Listed in ./config.json
 * new-member-dm: DMs any user who joins with a welcome message
 * new-member-massdm: DMs all New Members every 24 hours
 * emergency: Sends an email to the acmpr admin account when someone mentions @EMERGENCY
*/

// @requires
const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const { prefix, token } = require('./config.json');
const nodemailer = require('nodemailer');

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

// nodemailer setup
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'email',
        pass: 'password'
    },
});

// Logging channels setup
let joinleave, modchanges, messageedits, roles, misc, adminchat;
const redLog = '#ff0000';
const greenLog = '#00ff00';
const blueLog = '#0000ff';

// Once bot start
client.once('ready', () => {
    const acmpr = client.guilds.resolve('418632305721081866');
    joinleave = acmpr.channels.resolve('530658767168339968');
    modchanges = acmpr.channels.resolve('531917188177723393');
    messageedits = acmpr.channels.resolve('531914902537764895');
    roles = acmpr.channels.resolve('531915087540256791');
    misc = acmpr.channels.resolve('531917254405914624');
    adminchat = acmpr.channels.resolve('689449871408627746');
    console.log('Bot Ready\nDate: ' + new Date(Date.now()).toString());
    setInterval(function () {
        if (fs.statSync('./output.log').size > 0) {
            const logFile = new Discord.MessageAttachment('./output.log', 'output.log');
            acmpr.channels.resolve('716809248314621968').send('Output log for ' + new Date(Date.now()).toString() + '.', logFile).catch(error => {
                acmpr.channels.resolve('716809248314621968').send('<@317420516719853578> <@118661747069550593> There was an error sending the log file: ' + error);
            });
        }
        console.log('Final Alert');
        acmpr.roles.resolve('419925796765827082').members.forEach(member => {
            setTimeout(function () {
                if (member.joinedAt + 172800000 < Date.now()) {
                    if (member.user.bot) { return; }
                    console.log('Final Alert: ' + member.user.tag);
                    member.roles.add('468108656890740737');
                }
            }, 500);
        });
        acmpr.channels.resolve('469218909384605708').send('<@&468108656890740737> you have not completed your registrations and your accounts are marked for deletion.\nPlease complete the registration process to avoid being kicked.\nIf you have any questions regarding this, please post them in <#461723073427800094>');
        console.log('New Member DM');
        acmpr.roles.resolve('419925796765827082').members.forEach(member => {
            setTimeout(function() {
                if (member.user.bot) return;
                console.log('New Member DM: ' + member.user.tag);
                member.send('Please remember to complete the new member registration located in #welcome-and-registration\nThose who do not complete this will have their accounts marked for deletion after 48 hours.\nIf you have any questions regarding this message or the registration process, please ask in #new-member-questions').catch(() => {});
            }, 10000);
        });
        console.log('Member Check');
        acmpr.members.cache.each(member => {
            setTimeout(function() {
                if (member.user.bot) { return; }
                if (member.roles.cache.has('419925796765827082') ||
                member.roles.cache.has('696592178037784668') ||
                member.roles.cache.has('683739256514150484') ||
                member.roles.cache.has('419924092116926491') ||
                member.roles.cache.has('421100726438330394')) { return; }
                if ((member.roles.cache.has('418795748327555072') || member.roles.cache.has('418795552415678464') || member.roles.cache.has('418795893664514049') || member.roles.cache.has('717407911046938664')) && (member.roles.cache.has('418889674468360213') || member.roles.cache.has('418889869545177088') || member.roles.cache.has('418890279454638080') || member.roles.cache.has('418889911031169024') || member.roles.cache.has('418889979905703958'))) { return; }
                console.log('Member Check Failed: ' + member.user.tag);
                member.send('At least 1 game role and 1 platform role is required in the server. You have been re-assigned the "New Member" role because you lack one of these. Please go to #welcome-and-registration and follow the four steps there to rejoin the server.').catch(() => {});
                member.roles.add('419925796765827082');
            }, 10000);
        });
    }, 86400000);
});

// On message received
client.on('message', message => {
    // emergency functionality
    if (message.content.includes('<@&716809412588732506>')) {
        return transporter.sendMail({
            from: '"ACMPR Discord Emergency Notifier" <email>',
            to: 'email',
            subject: 'ACMPR Emergency',
            text: `${message.author.tag} used the @EMERGENCY tag in ${message.channel.name}.\nTheir message: ${message.content}`,
        }).then(() => {
            console.log(`Emergency email sent!\nMessage: ${message.content}\nAuthor: ${message.author.tag}\nChannel: ${message.channel.name}`);
        }).catch(err => {
            message.channel.reply('there was an error raising the emergency!');
            console.log(`Emergency email error: ${err}`);
        });
    }

    // Bad LFG check
    if ((
        message.content.includes('<@&700363627408130118>') ||
        message.content.includes('<@&700363629920387205>') ||
        message.content.includes('<@&700363632705273978>') ||
        message.content.includes('<@&717470756249796660>') ||
        message.content.includes('<@&700363698224496651>') ||
        message.content.includes('<@&700363699931840706>') ||
        message.content.includes('<@&700363702406479934>')) && !(
        message.channel.id == '419688771546644491' ||
        message.channel.id == '419688795076820992' ||
        message.channel.id == '419688824562778113' ||
        message.channel.id == '419688846351925268' ||
        message.channel.id == '419688879092662282'
        )) { return message.reply('LFG pings are restricted to #game channel list, please limit pings to these channels only'); }

    // Return if message is from bot or doesn't start with prefix
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // Set up args
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log('Message: ' + message.content + '\nAuthor: ' + message.author.tag + '\nChannel: ' + message.channel.name);
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    
    // Check for guildOnly flag
    if (command.guildOnly && message.channel.type !== 'text' && message.author.id !== '317420516719853578') { return message.reply('I can\'t execute that command inside DMs!'); }
    
    // Check for roleOnly flag
    if (command.roleOnly && message.author.id !== '317420516719853578') {
        let flag = false;
        for (const roleId of command.roleOnly) { if (message.member.roles.cache.has(roleId)) { flag = true; } }
        if (!flag) { return message.reply('you don\'t have permission to execute that command.'); }
    }

    // Check for permissions flag
    if (command.permissions && message.author.id !== '317420516719853578') {
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
        if (now < expirationTime && message.author.id !== '317420516719853578') {
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

// On member join
client.on('guildMemberAdd', member => {
    if (member.user.bot) { return; }
    console.log('New Member joined: ' + member.user.tag + '\nDate: ' + new Date(Date.now()).toString());
    member.send('Welcome to Assassin\'s Creed Multiplayer Revival (ACMPR), the largest active AC Multiplayer community on the web.\nPlease check the #welcome-and-registration channel and ensure that you have completed steps 1-4 of the new member process.\nOnce you have completed this process you will be granted full access to all discord channels.\nIf you have any questions simply post them in the #new-member-questions channel and our mods will assist you.').catch(() => {});
});

// Logging
client.on('guildMemberAdd', member => {
    console.log('guildMemberAdd');
    joinleave.send(new Discord.MessageEmbed().setColor(greenLog).setAuthor('Member Joined', member.user.displayAvatarURL()).setDescription(`${member} ${member.user.tag}`).setThumbnail(member.user.displayAvatarURL()).setTimestamp().setFooter(`ID: ${member.id}`));
});
client.on('guildMemberRemove', member => {
    console.log('guildMemberRemove');
    joinleave.send(new Discord.MessageEmbed().setColor(redLog).setAuthor('Member Joined', member.user.displayAvatarURL()).setDescription(`${member} ${member.user.tag}`).setThumbnail(member.user.displayAvatarURL()).setTimestamp().setFooter(`ID: ${member.id}`));
});
client.on('guildBanAdd', (guild, user) => {
    console.log('guildBanAdd');
    modchanges.send(new Discord.MessageEmbed().setColor(redLog).setAuthor('Member Banned', user.displayAvatarURL()).setDescription(`${user} ${user.tag}`).setThumbnail(user.displayAvatarURL()).setTimestamp().setFooter(`ID: ${user.id}`));
});
client.on('guildBanRemove', (guild, user) => {
    console.log('guildBanRemove');
    modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setAuthor('Member Unbanned', user.displayAvatarURL()).setDescription(`${user} ${user.tag}`).setThumbnail(user.displayAvatarURL()).setTimestamp().setFooter(`ID: ${user.id}`));
});
client.on('messageUpdate', (oldM, newM) => {
    console.log('messageUpdate');
    if (newM.channel.id == adminchat.id) { return; }
    if (newM.author.bot) { return; }
    messageedits.send(new Discord.MessageEmbed().setColor(blueLog).setAuthor(newM.author.tag, newM.author.displayAvatarURL()).setDescription(`**Message edited in** ${newM.channel.toString()} [Jump to Message](${newM.url})`).addField('Before', '\u200B' + oldM.content).addField('After', '\u200B' + newM.content).setTimestamp().setFooter(`User ID: ${newM.author.id}`));
});
client.on('messageDelete', message => {
    console.log('messageDelete');
    if (message.channel.id == adminchat.id) { return; }
    messageedits.send(new Discord.MessageEmbed().setColor(redLog).setAuthor(message.author.tag, message.author.displayAvatarURL()).setDescription(`**Message sent by** ${message.author.toString()} **deleted in** ${message.channel.toString()}\n${message.content}`).setTimestamp().setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`));
});
client.on('messageDeleteBulk', coll => {
    console.log('messageDeleteBulk');
    if (coll.first().channel.id == adminchat.id) { return; }
    messageedits.send(new Discord.MessageEmbed().setColor(redLog).setDescription(`**[BULK] Bulk Delete in** ${coll.first().channel.toString()}, ${coll.size} messages deleted`).setTimestamp());
    coll.sort((mID, message) => -message.createdAt).each(message => {
        messageedits.send(new Discord.MessageEmbed().setColor(redLog).setAuthor(message.author.tag, message.author.displayAvatarURL()).setDescription(`**[BULK] Message sent by** ${message.author.toString()} **deleted in** ${message.channel.toString()}\n${message.content}`).setTimestamp().setFooter(`User ID: ${message.author.id} | Message ID: ${message.id}`));
    });
})
client.on('channelCreate', channel => {
    if (channel.type == 'dm' || channel.type == 'unknown') { return; }
    console.log('channelCreate');
    modchanges.send(new Discord.MessageEmbed().setColor(greenLog).setDescription(`**Channel Created:** ${channel.toString()}`).setTimestamp().setFooter(`ID: ${channel.id}`));
});
client.on('channelDelete', channel => {
    if (channel.type == 'dm' || channel.type == 'unknown') { return; }
    console.log('channelDelete');
    modchanges.send(new Discord.MessageEmbed().setColor(redLog).setDescription(`**Channel Deleted:** ${channel.name}`).setTimestamp().setFooter(`ID: ${channel.id}`));
});
client.on('roleCreate', role => {
    console.log('roleCreate');
    modchanges.send(new Discord.MessageEmbed().setColor(greenLog).setDescription(`**Role Created:** ${role.toString()}`).setTimestamp().setFooter(`ID: ${role.id}`));
});
client.on('roleDelete', role => {
    console.log('roleDelete');
    modchanges.send(new Discord.MessageEmbed().setColor(redLog).setDescription(`**Role Deleted:** ${role.name}`).setTimestamp().setFooter(`ID: ${role.id}`));
});
client.on('roleUpdate', (oldR, newR) => {
    console.log('roleUpdate');
    if (newR.hexColor !== oldR.hexColor) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Color Changed:** ${newR.name} ${oldR.hexColor} -> ${newR.hexColor}`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else if (newR.hoist !== oldR.hoist) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Hoist Changed:** ${newR.name} ${newR.hoist ? 'Members appear separate' : 'Members do not appear separate'}`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else if (newR.mentionable !== oldR.mentionable) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Mention Changed:** ${newR.name} ${newR.mentionable ? 'Members can mention role' : 'Members cannot mention role'}`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else if (newR.name !== oldR.name) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Name Changed:** ${oldR.name} -> ${newR.name}`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else if (!newR.permissions.equals(oldR.permissions)) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Permissions Changed:** ${newR.name}\nCheck Audit Log for changes`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else if (newR.position !== oldR.position) { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Position Changed:** ${newR.name} moved ${newR.comparePositionTo(oldR)} spots`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
    else { modchanges.send(new Discord.MessageEmbed().setColor(blueLog).setDescription(`**Role Updated: ${newR.name}\nCould not read change, check Audit Log`).setTimestamp().setFooter(`ID: ${newR.id}`)); }
});
client.on('guildMemberUpdate', (oldM, newM) => {
    console.log('guildMemberUpdate');
    if (!newM.roles.cache.equals(oldM.roles.cache)) {
        const roleDif = newM.roles.cache.difference(oldM.roles.cache);
        roleDif.each((role, id) => {
            if (newM.roles.cache.has(id)) { roles.send(new Discord.MessageEmbed().setColor(greenLog).setAuthor('Role Added', newM.user.displayAvatarURL()).setDescription(`${newM} **was given the** \`${role.name}\` **role**`).setTimestamp().setFooter(`ID: ${newM.id}`)); }
            else if (oldM.roles.cache.has(id)) { roles.send(new Discord.MessageEmbed().setColor(redLog).setAuthor('Role Removed', newM.user.displayAvatarURL()).setDescription(`${newM} **was removed from the** \`${role.name}\` **role**`).setTimestamp().setFooter(`ID: ${newM.id}`)); }
            else { roles.send(new Discord.MessageEmbed().setColor(blueLog).setAuthor('Roles Changed', newM.user.displayAvatarURL()).setDescription(`${newM}\nCould not read change, check Audit Log`).setTimestamp().setFooter(`ID: ${newM.id}`)); }
        });
    } else if (newM.nickname !== oldM.nickname) {
        let newNick, oldNick;
        if (newM.nickname) { newNick = newM.nickname; } else { newNick = 'None'; }
        if (oldM.nickname) { oldNick = oldM.nickname; } else { oldNick = 'None'; }
        misc.send(new Discord.MessageEmbed().setColor(blueLog).setAuthor(newM.user.tag, newM.user.displayAvatarURL()).setDescription(`${newM} **nickname changed**`).addField('Before', '\u200B' + oldNick).addField('After', '\u200B' + newNick).setTimestamp().setFooter(`ID: ${newM.id}`)); }
});
client.on('voiceStateUpdate', (oldS, newS) => {
    console.log('voiceStateUpdate');
    if (oldS.channel == null) { misc.send(new Discord.MessageEmbed().setColor(greenLog).setAuthor(newS.member.user.tag, newS.member.user.displayAvatarURL()).setDescription(`${newS.member} **joined voice channel** \`${newS.channel.name}\``).setTimestamp().setFooter(`ID: ${newS.member.id}`)); }
    else if (newS.channel == null) { misc.send(new Discord.MessageEmbed().setColor(redLog).setAuthor(oldS.member.user.tag, oldS.member.user.displayAvatarURL()).setDescription(`${oldS.member} **left voice channel** \`${oldS.channel.name}\``).setTimestamp().setFooter(`ID: ${oldS.member.id}`)); }
    else { misc.send(new Discord.MessageEmbed().setColor(blueLog).setAuthor(newS.member.user.tag, newS.member.user.displayAvatarURL()).setDescription(`${newS.member} **moved from** \`${oldS.channel.name}\` **to** \`${newS.channel.name}\``).setTimestamp().setFooter(`ID: ${newS.member.id}`)); }
});

// Login
client.login(token);