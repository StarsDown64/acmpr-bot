const { prefix } = require('../config.json');
module.exports = {
    name: 'help',
    aliases: ['info'],
    description: 'A dynamic help command.',
    guildOnly: false,
    args: false,
    usage: '[command/user]',
    cooldown: 5,
    execute(message, args) {
        // Function for extracting possible user from mention text
        function getUserFromText(arg) {
            const matchReturn = arg.match(/^<@!?(\d+)>$/);
            if (!matchReturn) return;
            const id = matchReturn[1];
            return client.users.cache.get(id);
        }
        
        const client = message.client;
        const data = [];
        const { commands } = message.client;
        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command]\` to get info on a specific command!`);
            return message.author.send(data, { split: true }).then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent you a DM with all my commands!');
            }).catch(error => {
                console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
                message.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
            });
        }
        const user = getUserFromText(args[0]);
        if (user) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command]\` to get info on a specific command!`);
            return user.send(data, { split: true }).then(() => {
                if (message.channel.type === 'dm') return;
                message.reply('I\'ve sent '+ user.toString() + ' a DM with all my commands!');
            }).catch(error => {
                console.error(`Could not send help DM to ${user.tag}.\n`, error);
                message.reply('it seems like I can\'t DM ' + user.toString() + '! Do they have DMs disabled?');
            });
        }
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
        if (!command) { return message.reply('that\'s not a valid command!'); }
        data.push(`**Name:** ${command.name}`);
        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
        data.push(`**Cooldown:** ${command.cooldown || 0} seconds(s)`);
        data.push('**Server Only:** ');
        data.push((command.guildOnly) ? 'Yes' : 'No');
        data.push('**Required Role:** ');
        data.push((command.roleEnglish) ? command.roleEnglish.join(', ') : 'None');
        data.push('**Required Permission:** ');
        data.push((command.permissions) ? command.permissions.join(', ') : 'None');
        message.channel.send(data, { split: true });
    },
};