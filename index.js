/* SERVER INVITE */
// https://discord.com/api/oauth2/authorize?client_id=968648306689466458&permissions=1099511704580&scope=bot

const SECONDS_FROM_FIRST_MESSAGE = 30
const MESSAGES_BEFORE_SUS = 3

const { Client, Intents, MessageActionRow, MessageButton } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const stopPhishing = require('stop-discord-phishing')
require('dotenv').config()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

let logChannelID = ['976603504179290222']
let users = []

client.on('interactionCreate', async interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);

    let guild = await client.guilds.fetch(interaction.guildId)
    let member = await guild.members.fetch(interaction.customId)
    let result = await member.setNickname(null, 'Nickname reset due to it not following community guidelines')
    let logChannel = await client.channels.fetch(logChannelID)
    await logChannel.send('Name reset successsful for <@' + member.id + '>')
    interaction.message.delete()
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    console.log("test")
    if (oldMember.nickname !== newMember.nickname && newMember.nickname !== null) {
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(newMember.id)
                .setLabel('Reset Nickname')
                .setStyle('DANGER'),
        );

        let logChannel = await client.channels.fetch(logChannelID)
        await logChannel.send({
            content: '**Changed Nickname** \n' + 
                '[Account]: <@' + newMember.id + '>' + '\n' +
                '[Old]: ' + oldMember.nickname + '\n' +
                '[New]: ' + newMember.nickname,
            components: [row]
        })
    }
})

client.on('messageCreate', async message => {
    if (message.author.bot) return 
    
    const { id, username } = message.author
    const channelId = message.channel.id

    if (await checkIfExistingUser(id)) {
        if (await checkIfNoExistingChannel(id, channelId)) {
            await updateUser(id, channelId)
        }
    } else {
        await addUser(id , username, channelId)
    }
    
    if (await hasSusBehavior(id)) {
        logMessage(message, `${message.author.username} might be **spamming**. Last message sent in <#${message.channel.id}>`)
    }

    if (await hasSusLink(message.content)) {
        logMessage(message, `${message.author.username} might have sent a **malicious link** in <#${message.channel.id}>`)
    }
});

const logMessage = async (messageObject, message) => {
    let logChannel = await messageObject.guild.channels.fetch(logChannelID)
    logChannel.send(message)
}

const addUser = (id, username, channelId) => {
    users.push({
        id,
        username,
        channelsMessaged: 1,
        channels: [channelId],
        firstMessageTime: new Date()
    })
    //console.log(users)
}

const updateUser = async (id, channelId) => {
    let userIndex = users.findIndex(user => user.id == id)
    users[userIndex].channelsMessaged += 1
    users[userIndex].channels.push(channelId)
}

const checkIfExistingUser = async (id) => {
    const user = users.find(element => element.id === id)
    return user ? true : false
}

const checkIfNoExistingChannel = async (id, channel) => {
    const user = users.find(element => element.id === id)
    if (user) {
        const channelCheck = user.channels.includes(channel)
        return channelCheck ? false : true
    }
    return false
}

const hasSusBehavior = async (id) => {
    const user = users.find(element => element.id === id)
    if (user) {
        if (user.channelsMessaged >= MESSAGES_BEFORE_SUS) {
            return true
        }
        return false
    }
    return false
}

const hasSusLink = async (message) => {
    if (message.includes("notasuslinkatall.com")) return true
    return stopPhishing.checkMessage(message)
}

client.login(process.env.TOKEN);

// Job for updating message list
let CronJob = require('cron').CronJob;
let job = new CronJob('* * * * * *', function() {
    let currentTime = new Date()
    users = users.filter((element) => currentTime - element.firstMessageTime < 1000 * SECONDS_FROM_FIRST_MESSAGE) // Keep anything less than 5 seconds old
    console.log(users)
}, null, true, 'America/Los_Angeles');
job.start();