module.exports = {
    name: 'prune',
    aliases: ['bulkdelete'],
    description: 'Bulk delete x messages between 1 and 99.',
    guildOnly: true,
    permissions: ['MANAGE_MESSAGES'],
    args: true,
    usage: '<number>',
    execute(message, args) {
        const amount = parseInt(args[0]) + 1;
        if (isNaN(amount)) { return message.reply('that doesn\'t seem to be a valid number.'); }
        else if (amount <= 1 || amount > 100) { return message.reply('you need to input a number between 1 and 99.'); }
        message.channel.bulkDelete(amount, true).catch(err => {
            console.log('Error ' + err);
            message.channel.send('There was an error trying to prune messages in this channel.');
        });
    },
};