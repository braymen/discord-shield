module.exports = async (message) => {
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

}