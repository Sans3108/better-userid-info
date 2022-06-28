const { Plugin } = require('powercord/entities');

class UserIDInfo extends Plugin {
  startPlugin() {
    powercord.api.commands.registerCommand({
      command: 'uid',
      aliases: ['userinfo', 'userid'],
      label: 'Better UserID Info',
      usage: '{c} <id>',
      description: 'Gets and displays user information from a user ID.',
      executor: (id) => {
        return this.getInfo(id.toString().replace('<', '').replace('>', '').replace('!', '').replace('@', ''));
      }
    })
  }

  async getInfo(id) {
    try {
      let userObject = await (await require('powercord/webpack').getModule(['acceptAgreements', 'getUser'])).getUser(String(id));
      let userName = userObject['username'] + '#' + userObject['discriminator'];
      let avatarURL = !userObject['avatar'] ? 'Default avatar, no link or thumbnail available.' : `https://cdn.discordapp.com/avatars/${id}/${userObject['avatar']}`;
      let isBot = String(userObject['bot']);
      let timestamp = Math.trunc((parseInt(BigInt(id) >> 22n) + 1420070400000) / 1000);

      let embed = {
        type: 'rich',
        title: `ID lookup for **${id}**`,
        color: 0x5865F2,
        fields: [{
          name: 'Username',
          value: userName,
          inline: true
        }, {
          name: 'Tag',
          value: `<@${id}>`,
          inline: true
        }, {
          name: 'Bot',
          value: `${isBot}`,
          inline: true
        }, {
          name: 'Avatar',
          value: avatarURL.startsWith('Default') ? avatarURL : `[Click here to open avatar link.](${avatarURL} "${userName.slice(0, -5)}'s avatar")`,
          inline: false
        }, {
          name: 'Created',
          value: `<t:${timestamp}> (<t:${timestamp}:R>)`,
          inline: false
        }]
      }

      if (!avatarURL.startsWith('Default')) {
        embed.thumbnail = {
          url: avatarURL,
          proxy_url: avatarURL,
          height: 128,
          width: 128
        }
      }

      return {
        result: embed,
        embed: true
      }
    } catch (err) {
      return {
        result: `Invalid ID.`
      }
    }
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand('uid');
  }
}

module.exports = UserIDInfo;
