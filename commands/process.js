module.exports = {
    name: 'process',
    aliases: ['welcome', 'p', 'w'],
    description: 'Removes the New Member status from mentioned users and notifies them',
    guildOnly: true,
    roleOnly: ['[REDACTED] @Mod-In-Training', '[REDACTED] @Moderator', '[REDACTED] @Admins'],
    roleEnglish: ['Mod-In-Training', 'Moderator', 'Admins'],
    args: true,
    usage: '<user 1> [user 2] [user 3] ...',
    execute(message, args) {
        // Function for extracting possible user from mention text
        function getUserFromText(arg) {
            const matchReturn = arg.match(/^<@!?(\d+)>$/);
            if (!matchReturn) return false;
            const id = matchReturn[1];
            return client.users.cache.get(id);
        }

        const client = message.client;
        const data = [];
        for (const arg of args) {
            data.push('\n');
            const user = getUserFromText(arg);
            if (!user) {
                data.push(arg + ': Not a user');
                continue;
            }
            const member = message.guild.member(user);
            data.push(user.toString() + ': ');
            if (!member.roles.cache.has('[REDACTED] @New Member')) {
                data.push('Does not have New Member role.');
                continue;
            }
            if (!((member.roles.cache.has('[REDACTED] @Xbox 360 / Xbox One') || member.roles.cache.has('[REDACTED] @PS3 / PS4') || member.roles.cache.has('[REDACTED] @PC')) && (member.roles.cache.has('[REDACTED] @Brotherhood') || member.roles.cache.has('[REDACTED] @Revelations') || member.roles.cache.has('[REDACTED] @III') || member.roles.cache.has('[REDACTED] @Black Flag') || member.roles.cache.has('[REDACTED] @Unity')))) {
                data.push('Does not meet requirements');
                continue;
            }
            member.roles.remove('[REDACTED] @New Member', 'Processed by bot');
            if (member.roles.cache.has('[REDACTED] @removeme')) { member.roles.remove('[REDACTED] @removeme', 'Processed by bot'); }

            // LFG Boosting Check
            if (member.roles.cache.has('[REDACTED] @LFG BOOSTING - XBOX') || member.roles.cache.has('[REDACTED] @LFG BOOSTING - PC') || member.roles.cache.has('[REDACTED] @LFG BOOSTING - PSN')) {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nBe sure to check out the boosting event sign up list in the #boosting-interest channel.').catch(() => {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nBe sure to check out the boosting event sign up list in the <#490199175590576129> channel.');
                });
                data.push('Processed (Boosting User)');
            }

            // else LFG Check
            else if (member.roles.cache.has('[REDACTED] @LFG - Xbox') || member.roles.cache.has('[REDACTED] @LFG - PSN') || member.roles.cache.has('[REDACTED] @LFG - PC')) {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.').catch(() => {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.');
                });
                data.push('Processed (LFG User)');
            }

            // else
            else {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them?').catch(() => {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them? If not, please DM a Staff member for help.');
                });
                data.push('Processed (Non-LFG User)');
            }
        }
        message.channel.send(data.slice(1).join(''));
    },
};