module.exports = {
    name: 'collectbots',
    aliases: [],
    description: 'Sends a message containing all bots on the server',
    guildOnly: true,
    roleOnly: ['421100726438330394'],
    roleEnglish: ['Admins'],
    args: false,
    execute(message, args) {
        let out = '';
        message.guild.members.fetch().then(mems => {
            mems.each(member => {
                if (member.user.bot) { out += member.user.tag + '\n'; }
            });
            if (!out) { return message.channel.send('There\'s no bots on this server.'); }
            message.channel.send('All bots:\n' + out);
        }).catch(error => {
            console.log('collectbots error: ' + error)
        });
        
    }
}