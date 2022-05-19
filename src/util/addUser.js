let users = []

module.exports = async (id, username, channelId) => {
    users.push({
        id,
        username,
        channelsMessaged: 1,
        channels: [channelId],
        firstMessageTime: new Date()
    })
}