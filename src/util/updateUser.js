module.exports = async (id, channelId) => {
    let userIndex = users.findIndex(user => user.id == id)
    users[userIndex].channelsMessaged += 1
    users[userIndex].channels.push(channelId)
}