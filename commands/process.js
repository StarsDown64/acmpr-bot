module.exports = {
    name: 'process',
    aliases: ['welcome', 'p', 'w'],
    description: 'Removes the New Member status from mentioned users and notifies them',
    guildOnly: true,
    roleOnly: ['683739256514150484', '419924092116926491', '421100726438330394'],
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
            if (!member.roles.cache.has('419925796765827082')) {
                data.push('Does not have New Member role.');
                continue;
            }
            if (!((member.roles.cache.has('418795748327555072') || member.roles.cache.has('418795552415678464') || member.roles.cache.has('418795893664514049') || member.roles.cache.has('717407911046938664')) && (member.roles.cache.has('418889674468360213') || member.roles.cache.has('418889869545177088') || member.roles.cache.has('418890279454638080') || member.roles.cache.has('418889911031169024') || member.roles.cache.has('418889979905703958')))) {
                data.push('Does not meet requirements');
                continue;
            }
            member.roles.remove('419925796765827082', 'Processed by bot');
            if (member.roles.cache.has('468108656890740737')) { member.roles.remove('468108656890740737', 'Processed by bot'); }

            // LFG Boosting Check
            if (member.roles.cache.has('700363698224496651') || member.roles.cache.has('700363699931840706') || member.roles.cache.has('700363702406479934')) {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.').catch(() => {
                    client.channels.cache.get('504295342695514113').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.');
                });
                data.push('Processed (Boosting User)');
            }

            // else LFG Check
            else if (member.roles.cache.has('700363627408130118') || member.roles.cache.has('700363629920387205') || member.roles.cache.has('700363632705273978') || member.roles.cache.has('717470756249796660')) {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.').catch(() => {
                    client.channels.cache.get('504295342695514113').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.');
                });
                data.push('Processed (LFG User)');
            }

            // else
            else {
                user.send('Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them?').catch(() => {
                    client.channels.cache.get('504295342695514113').send(user.toString() + ' Welcome to ACMPR, your new member status has been removed and you should now have full access to the discord.\nAlso, did you fully understand how the @LFG roles work and where to go to assign them? If not, please DM a Staff member for help.');
                });
                data.push('Processed (Non-LFG User)');
            }
        }
        message.channel.send(data.slice(1).join(''));
    },
};