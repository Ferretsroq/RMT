const {SlashCommandBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder} = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('rmt')
	.setDescription('Paste a team to rate!'),
	async execute(interaction)
	{
		const modal = new ModalBuilder().setCustomId('rmtModal').setTitle('Rate My Team!');
		const pasteInput = new TextInputBuilder().setCustomId('rmtPokepasteInput').setLabel('Pokepaste Here').setStyle(TextInputStyle.Short);
		const description = new TextInputBuilder().setCustomId('rmtDescription').setLabel('Summarize your team.').setStyle(TextInputStyle.Short);
		const struggles = new TextInputBuilder().setCustomId('rmtStruggles').setLabel('What have you struggled against?').setStyle(TextInputStyle.Paragraph);
		const details = new TextInputBuilder().setCustomId('rmtDetails').setLabel('Explain your unusual choices, if any.').setStyle(TextInputStyle.Paragraph);
		const firstActionRow = new ActionRowBuilder().addComponents(pasteInput);
		const secondActionRow = new ActionRowBuilder().addComponents(description);
		const thirdActionRow = new ActionRowBuilder().addComponents(struggles);
		const fourthActionRow = new ActionRowBuilder().addComponents(details);
		modal.addComponents(firstActionRow, secondActionRow, thirdActionRow, fourthActionRow);
		await interaction.showModal(modal);
	},
	async Submit(interaction)
	{
		const paste = interaction.fields.getTextInputValue('rmtPokepasteInput');
		const description = interaction.fields.getTextInputValue('rmtDescription');
		const struggles = interaction.fields.getTextInputValue('rmtStruggles');
		const details = interaction.fields.getTextInputValue('rmtDetails');
		const embed = new EmbedBuilder().setTitle('Rate My Team!').setAuthor(interaction.member.user.username).setDescription(`**Paste:** ${paste}\n\n**Summary:**\n\n${description}\n\n**Struggles:**\n\n${struggles}\n\n**Special Details:**\n${details}`);
		await interaction.reply({embeds: [embed]});
		const message = await interaction.fetchReply();
		const thread = await message.startThread({name: `${interaction.member.user.username}'s RMT`, authoArchiveDuration: 60, reason: 'RMT Thread'});
	},
	
};