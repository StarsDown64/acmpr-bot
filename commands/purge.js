module.exports = {
    name: 'purge',
    aliases: [],
    description: 'Kicks all members with the removeme role',
    guildOnly: true,
    roleOnly: ['419924092116926491', '421100726438330394'],
    roleEnglish: ['Moderator', 'Admins'],
    args: false,
    execute(message, args) {
        message.guild.roles.resolve('468108656890740737').members.forEach(member => {
            member.kick();
        });
    },
};