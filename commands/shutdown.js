module.exports = {
    name: 'shutdown',
    aliases: ['stop'],
    description: 'Shuts the bot down',
    guildOnly: false,
    roleOnly: ['[REDACTED] @Admins'],
    roleEnglish: ['Admins'],
    args: false,
    execute(message, args) {
        message.reply('the bot has been shut down.').then(() => {
            console.log('Bot shutdown via command');
            process.exit(0);
        });
    },
};