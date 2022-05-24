const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Basically the help command"),

  async execute(interaction) {
    const pingembed = new MessageEmbed()

      .setColor("#5865f4")
      .setTitle("Your average Help command")
      .setDescription("This is a help command. It's not very useful, but it's here if you need it.")
      .setTimestamp();

    await interaction.reply({
      embeds: [pingembed]
    });
  },
};
