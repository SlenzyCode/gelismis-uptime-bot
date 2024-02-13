const { ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const { AdvancedEmbed, AdvancedEmbedType } = require("utilscord");

module.exports = {
    name: "uptime-panel-kur",
    description: 'Uptime panelini kurarsınız',
    type: 1,
    options: [],
    /** @param {import("discord.js").ChatInputCommandInteraction} interaction */
    run: async (client, interaction) => {
        const hata = new AdvancedEmbed()
            .setInteraction(interaction)
            .setDescription("> Bu komudu kullanabilmek için `Sunucu Sahibi` olmalısın.")
            .setStyle(AdvancedEmbedType.Error)
        if (!interaction.guild.ownerId) return interaction.reply({ embeds: [hata], ephemeral: true });
        const embed = new AdvancedEmbed()
            .setDefaultColor("DarkButNotBlack")
            .setInteraction(interaction)
            .setDescription("> Aşağıdaki bölümden uptime sisteminin bilgilerine bakabilirsiniz.")
            .addFields([
                { name: "🔗 Link Ekle", value: "Uptime sistemine link eklersiniz.", inline: true },
                { name: "🔗 Linklerim", value: "Uptime sistemindeki linklerinizi görürsünüz.", inline: true }
            ])
            .setStyle(AdvancedEmbedType.Default);
        const basari = new AdvancedEmbed()
        .setInteraction(interaction)
        .setDescription("Başarıyla uptime sistemini sunucuya kurdum.")
        .setStyle(AdvancedEmbedType.Success)
        const button = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Link Ekle")
                    .setEmoji("<:Arti:1043196286117085214>")
                    .setStyle(ButtonStyle.Success)
                    .setCustomId('linkEkle'),
                new ButtonBuilder()
                    .setLabel("Linklerim")
                    .setEmoji("<:lourity_link:1063795370871758858>")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId('linklerim')
            )
        interaction.reply({ embeds: [basari], ephemeral: true });
        interaction.channel.send({ embeds: [embed], components: [button] });
    }
};