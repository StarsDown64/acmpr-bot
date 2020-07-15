const Discord = require('discord.js');
module.exports = {
    name: 'shutdown',
    aliases: ['stop'],
    description: 'Shuts the bot down',
    guildOnly: false,
    roleOnly: ['421100726438330394'],
    roleEnglish: ['Admins'],
    args: false,
    execute(message, args) {
        console.log('Bot shutdown initiated.');
        const logFile = new Discord.MessageAttachment('./output.log', 'output.log');
        message.guild.channels.resolve('716809248314621968').send('Shutdown initiated. Dumping output.log', logFile).catch(error => {
            message.guild.channels.resolve('716809248314621968').send('<@317420516719853578> <@118661747069550593> There was an error sending the log file: ' + error);
            console.log('Bot shutdown failure.');
        }).then(function () {
            message.reply('the bot has been shut down.').then(() => {
                message.client.destroy();
                process.exit(0);
            });
        });
    },
};