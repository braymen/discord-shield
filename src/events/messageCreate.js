const { MESSAGES_BEFORE_SUS } = require("../../config.json")

const stopPhishing = require('stop-discord-phishing')

let users = []

module.exports = async (message) => {
    console.log(message)
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
};

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
    if (message.includes()) return true
    return stopPhishing.checkMessage(message)
}
