const Discord = require('discord.js');
module.exports = {
    name: 'purge',
    aliases: [],
    description: 'Kicks all members with the removeme role',
    guildOnly: true,
    roleOnly: ['419924092116926491', '421100726438330394'],
    roleEnglish: ['Moderator', 'Admins'],
    args: false,
    execute(message, args) {
        const list = [];
        message.guild.roles.resolve('468108656890740737').members.forEach(member => {
            member.kick().then(member => {
                list.push(member.id);
            });
        });
        setTimeout(function () {
            message.guild.channels.resolve('530658767168339968').send(new Discord.MessageEmbed().setColor('#ff0000').setAuthor(`${list.length} members purged`).setDescription(`${list.join('\n')}`).setTimestamp().setFooter(`${list.length} members`));
        }, 10000);
    },
};