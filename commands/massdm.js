module.exports = {
    name: 'massdm',
    aliases: ['mdm'],
    description: 'Sends a DM to all members with a given role.',
    guildOnly: true,
    roleOnly: ['[REDACTED] Admins'],
    roleEnglish: ['Admins'],
    args: true,
    usage: '<role> <message>',
    execute(message, args) {
        const role = message.guild.roles.resolve(args[0].slice(3, -1));
        if (!role) { return message.reply(`${role} is not a valid role.`); }
        const msg = args.slice(1).join(' ');
        role.members.forEach(member => {
            setTimeout(function() {
                if (member.bot) return;
                console.log(member.user.tag + ' ' + member.toString());
                member.send(msg).catch();
            }, 10000);
        });
    },
};