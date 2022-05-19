require(dotenv).config();

let logChannelID = process.env.logChannelID;

module.exports = async (messageObject, message) => {
  let logChannel = await messageObject.guild.channels.fetch(logChannelID);
  logChannel.send(message);
};
