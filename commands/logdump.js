const Discord = require('discord.js');
module.exports = {
    name: 'logdump',
    aliases: [],
    description: 'Sends the current output.log to log channel, does not wipe log',
    guildOnly: true,
    roleOnly: ['421100726438330394'],
    roleEnglish: ['Admins'],
    execute(message, args) {
        const logFile = new Discord.MessageAttachment('./output.log', 'output.log');
        message.guild.channels.resolve('716809248314621968').send('Output log for ' + new Date(Date.now()).toString() + '.', logFile).catch(error => {
            message.reply('There was an error sending the log file: ' + error);
        });
    },
};