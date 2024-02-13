const {
  PermissionsBitField,
  ButtonStyle,
  Client,
  GatewayIntentBits,
  ChannelType,
  Partials,
  ActionRowBuilder,
  SelectMenuBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  InteractionType,
  SelectMenuInteraction,
  ButtonBuilder,
  AuditLogEvent,
} = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://slenzyycode:cDkdgXdRPe@cluster0.idagmob.mongodb.net/").then(() => {
  console.log("Mongo bağlandı.")
});
const config = require("./config.json");
const { AdvancedEmbed, AdvancedEmbedType } = require("utilscord");

const client = new Client({
  intents: Object.values(Discord.IntentsBitField.Flags),
  partials: Object.values(Partials),
});

const chalk = require("chalk");

global.client = client;
client.commands = global.commands = [];
const { readdirSync } = require("fs");
const { uptime } = require("os");
readdirSync("./commands").forEach((f) => {
  if (!f.endsWith(".js")) return;

  const props = require(`./commands/${f}`);

  client.commands.push({
    name: props.name.toLowerCase(),
    description: props.description,
    options: props.options,
    dm_permission: false,
    type: 1,
  });
  console.log(chalk.red`[COMMAND]` + ` ${props.name} komutu yüklendi.`);
});

readdirSync("./events").forEach((e) => {
  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
    eve(client, ...args);
  });
  console.log(chalk.blue`[EVENT]` + ` ${name} eventi yüklendi.`);
});

client.login(config.bot.token);

process.on("unhandledRejection", async (error) => {
  return console.log(chalk.red(`Bir hata oluştu!\n\n${error}`));
});

client.on("interactionCreate", async (interaction) => {
  const UserModel = require("./models/user");
  //* Link Ekle
  if (interaction.customId === 'linkEkle') {
    const modal = new ModalBuilder()
      .setCustomId('linkEkle_Form')
      .setTitle("Link Ekle")
    const project_name = new TextInputBuilder()
      .setCustomId('project_name')
      .setLabel("Proje Adı")
      .setMaxLength(30)
      .setPlaceholder("Buraya proje adınızı giriniz.")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
    const plugin = new TextInputBuilder()
      .setCustomId('plugin')
      .setLabel("Uptime Link")
      .setMaxLength(40)
      .setPlaceholder("Buraya uptime linkinizi giriniz.")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
    const row = new ActionRowBuilder().addComponents(plugin);
    const row1 = new ActionRowBuilder().addComponents(project_name);
    modal.addComponents(row1, row);
    await interaction.showModal(modal);
  };
  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === 'linkEkle_Form') {
      const project_name = interaction.fields.getTextInputValue("project_name");
      const uptime_link = interaction.fields.getTextInputValue("plugin");
      const hata = new AdvancedEmbed()
        .setInteraction(interaction)
        .setDescription("> Uptime sistemine link ekler iken linkiniz `https://` ile başlamalı.")
        .setStyle(AdvancedEmbedType.Error)
      const basarili = new AdvancedEmbed()
        .setInteraction(interaction)
        .setDescription(`> Uptime linkinizi sisteme ekledim \`2 veya 5\` dakika içinde linkin aktif olacaktır.`)
        .addFields([
          { name: "🔗 Eklediğin Link", value: `${uptime_link}`, inline: true }
        ])
        .setStyle(AdvancedEmbedType.Success)
      if (!uptime_link.includes("https://")) return interaction.reply({ embeds: [hata], ephemeral: true });
      const ProjectLimit = 2;

      const user = await UserModel.findOne({ user_id: interaction.user.id });
      if (user && user.links.length > ProjectLimit) return interaction.reply({ content: "Link limitiniz dolu.", ephemeral: true });
      if (user && user.links.some((cmd) => cmd.uptime_link === uptime_link)) return interaction.reply({ content: "Linkiniz zaten sistemde bulunuyor.", ephemeral: true })
      await UserModel.updateOne(
        { user_id: interaction.user.id },
        {
          $push: {
            links: {
              project_name: project_name,
              uptime_link: uptime_link
            }
          }
        },
        { upsert: true }
      );

      interaction.reply({ embeds: [basarili], ephemeral: true });
    };
  };
  //* Link Sil
  if (interaction.customId === 'linkSil') {
    const modal = new ModalBuilder()
      .setCustomId('linkSil_Form')
      .setTitle("Link Sil");

    const plugin = new TextInputBuilder()
      .setCustomId('plugin')
      .setLabel("Uptime Link")
      .setMaxLength(40)
      .setPlaceholder(`Uptime sisteminden silinecek link.`)
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const row = new ActionRowBuilder().addComponents(plugin);
    modal.addComponents(row);

    return await interaction.showModal(modal);
  }
  if (interaction.type === InteractionType.ModalSubmit) {
    if (interaction.customId === 'linkSil_Form') {
      const uptime_link = interaction.fields.getTextInputValue("plugin");
      await UserModel.findOneAndUpdate({
        user_id: interaction.user.id
      }, {
        $pull: {
          links: {
            uptime_link: uptime_link
          }
        }
      }, {
        upsert: true
      })
      interaction.reply({ content: "Başarılı.", ephemeral: true });
    }
  }


  //* Link Düzenle
  if (interaction.customId === 'linklerim') {
    const user = await UserModel.findOne({ user_id: interaction.user.id });

    const embed = new AdvancedEmbed()
      .setInteraction(interaction)
      .setDescription("> Uptime sistemindeki linkleri silmek için `Link Sil` butonuna basabilirsiniz.")
      .addFields(
        user.links.map((link, index) => ({
          name: `Link ${index + 1}`,
          value: `**${link.project_name}** ( ${link.uptime_link} )`,
        }))
      ).setStyle(AdvancedEmbedType.Default);

    const button = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Link Sil")
          .setEmoji("<:lourity_cop:1063794639276093540>")
          .setStyle(ButtonStyle.Danger)
          .setCustomId('linkSil')
      );

    interaction.reply({ embeds: [embed], components: [button], ephemeral: true });
  };
});