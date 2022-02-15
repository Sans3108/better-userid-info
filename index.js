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
        if (id.toString().includes('@')) {
          id = id.toString().split('!').pop().split('>')[0]
        }
        return this.getInfo(id)
      }
    })
  }

  async getInfo(id) {
    try {
      let userObject = await (await require('powercord/webpack').getModule(['acceptAgreements', 'getUser'])).getUser(String(id));
      let userName = userObject['username'] + '#' + userObject['discriminator'];
      let avatarURL = !userObject['avatar'] ? 'Default avatar, no link available.' : `[Click here to open avatar link.](https://cdn.discordapp.com/avatars/${id}/${userObject['avatar']} "${userName.slice(-4)}'s avatar")`;
      let isBot = String(userObject['bot']);
      let unixTime = (id / 4194304) + 1420070400000;
      let jsTime = new Date(unixTime);
      let humanTime = `${(jsTime.getMonth() + 1) + '/' + jsTime.getDate() + '/' + jsTime.getFullYear()} (MM/DD/YYYY)`;
      function timeDifference(current, previous) { var msPerMinute = 60 * 1000; var msPerHour = msPerMinute * 60; var msPerDay = msPerHour * 24; var msPerMonth = msPerDay * 30; var msPerYear = msPerDay * 365; var elapsed = current - previous; if (elapsed < msPerMinute) { return Math.round(elapsed / 1000) + ' seconds ago' } else if (elapsed < msPerHour) { return Math.round(elapsed / msPerMinute) + ' minutes ago' } else if (elapsed < msPerDay) { return Math.round(elapsed / msPerHour) + ' hours ago' } else if (elapsed < msPerMonth) { return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago' } else if (elapsed < msPerYear) { return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago' } else { return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago' } }
      let currentTime = Date.now();
      let relativeTime = timeDifference(currentTime, unixTime)
      const embed = {
        type: 'rich',
        title: `ID lookup for **${id}**`,
        thumbnail: {
          url: avatarURL,
          proxy_url: avatarURL,
          height: 128,
          width: 128
        },
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
          value: avatarURL,
          inline: false
        }, {
          name: 'Created',
          value: `${humanTime} (${relativeTime}) Test: <t:${unixTime}:R>`,
          inline: false
        }]
      }
      return {
        result: embed,
        embed: true
      }
    } catch (err) {
      return {
        result: 'Invalid ID.'
      }
    }
  }

  pluginWillUnload() {
    powercord.api.commands.unregisterCommand('uid');
  }
}

module.exports = UserIDInfo;
