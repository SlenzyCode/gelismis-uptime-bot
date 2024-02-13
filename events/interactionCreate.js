const { Collection, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const { bot } = require("../config.json");

module.exports = async (client, interaction) => {
  const sunucuid = new EmbedBuilder()
  .setColor("Red")
  .setDescription("Bu botu bu sunucuda kullanamazsın.\nconfig.json dosyasından sunucu_id bölümüne girdiğin sunucuda kullanabilirsin")
  if (interaction.guildId !== bot.sunucu_id) return interaction.reply({ embeds: [sunucuid], ephemeral: true });
  if (interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    readdirSync('./commands').forEach(f => {

      const cmd = require(`../commands/${f}`);

      if (interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {

        return cmd.run(client, interaction);
      }
    });
  }
};