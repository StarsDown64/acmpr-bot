module.exports = {
    name: 'process',
    aliases: ['welcome'],
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
            if (!matchReturn) return;
            const id = matchReturn[1];
            return client.users.cache.get(id);
        }

        const client = message.client;
        const data = [];
        for (const arg of args) {
            data.push('\n');
            const user = getUserFromText(arg);
            const member = message.guild.member(user);
            if (!user) {
                data.push(arg + ': Not a user');
                continue;
            }
            data.push(user.toString() + ': ');
            if (!member.roles.cache.has('[REDACTED] @New Member')) {
                data.push('Does not have New Member role.');
                continue;
            }
            member.roles.remove('[REDACTED] @New Member', 'Processed by bot');
            if (member.roles.cache.has('[REDACTED] @removeme')) { member.roles.remove('[REDACTED] @removeme', 'Processed by bot'); }

            // LFG Boosting Check
            if (member.roles.cache.has('[REDACTED] @LFG BOOSTING - XBOX') || member.roles.cache.has('[REDACTED] @LFG BOOSTING - PC') || member.roles.cache.has('[REDACTED] @LFG BOOSTING - PSN')) {
                try {
                    user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nBe sure to check out the boosting event sign up list in the #boosting-interest channel.');
                } catch {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nBe sure to check out the boosting event sign up list in the [REDACTED] #boosting-interest channel.');
                }
                data.push('Processed (Boosting User)');
            }

            // else LFG Check
            else if (member.roles.cache.has('[REDACTED] @LFG - Xbox') || member.roles.cache.has('[REDACTED] @LFG - PSN') || member.roles.cache.has('[REDACTED] @LFG - PC')) {
                try {
                    user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.');
                } catch {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.');
                }
                data.push('Processed (LFG User)');
            }

            // else
            else {
                try {
                    user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them?')
                } catch {
                    client.channels.cache.get('[REDACTED] #member-questions').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them?');
                }
                data.push('Processed (Non-LFG User)');
            }
        }
        message.channel.send(data.slice(1).join(''));
    },
};