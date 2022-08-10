const {SlashCommandBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder} = require('discord.js');

module.exports = 
{
	data: new SlashCommandBuilder()
	.setName('rmt')
	.setDescription('Paste a team to rate!'),
	messages: {},
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
		const embed = new EmbedBuilder().setTitle('Rate My Team!').setAuthor({name: interaction.member.user.username}).setDescription(`**Paste:** ${paste}\n\n**Summary:**\n\n${description}\n\n**Struggles:**\n\n${struggles}\n\n**Special Details:**\n${details}`);
		await interaction.reply({embeds: [embed]});
		const message = await interaction.fetchReply();
		const thread = await message.startThread({name: `${interaction.member.user.username}'s RMT`, autoArchiveDuration: 60, reason: 'RMT Thread'});
		const row0 = new ActionRowBuilder();
		const row1 = new ActionRowBuilder();
		row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon1`).setLabel('Zacian-Crowned').setStyle(ButtonStyle.Primary));
		row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon2`).setLabel('Kyogre').setStyle(ButtonStyle.Primary));
		row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon3`).setLabel('Thundurus').setStyle(ButtonStyle.Primary));
		row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon4`).setLabel('Whimsicott').setStyle(ButtonStyle.Primary));
		row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon5`).setLabel('Incineroar').setStyle(ButtonStyle.Primary));
		row1.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon6`).setLabel('Amoonguss').setStyle(ButtonStyle.Primary));
		row1.addComponents(new ButtonBuilder().setCustomId(`rmtShowAll`).setLabel('Show Team').setStyle(ButtonStyle.Primary));
		const threadMessage = await thread.send({components: [row0, row1]});
		this.messages[threadMessage.id] = await this.ScrapePokemon(paste);
	},
	async ShowPokemon(interaction)
	{
		if(Object.keys(this.messages).includes(interaction.message.id))
		{
			const num = parseInt(interaction.customId[10]);
			const embed = this.messages[interaction.message.id][`pokemon${num}`].toEmbed();
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	},
	async ShowAllPokemon(interaction)
	{
		if(Object.keys(this.messages).includes(interaction.message.id))
		{
			let pokemonEmbeds = [];
			for(pokemon = 0; pokemon < Object.keys(this.messages[interaction.message.id]).length; pokemon++)
			{
				pokemonEmbeds.push(this.messages[interaction.message.id][Object.keys(this.messages[interaction.message.id])[pokemon]].toEmbed());
			}
			await interaction.reply({embeds: pokemonEmbeds, ephemeral: true});
		}
	},
	async ScrapePokemon(url)
	{
		const Pokemon1 = new Pokemon('Zacian-Crowned', 'Rusted Sword', 'Intrepid Sword', 50, 'Jolly', 'Behemoth Blade', 'Play Rough', 'Protect', 'Sacred Sword', 'https://pokepast.es/img/pokemon/888-1.png', hpEV="0", atkEV="252", defEV="0", spaEV="0", spdEV="4", speEV="252");
		//const Pokemon2 = new Pokemon('Kyogre', 'Mystic Water', 'Drizzle', 50, '252 SpA / 4 SpD / 252 Spe', 'Timid', 'Origin Pulse', 'Scald', 'Ice Beam', 'Protect', 'https://pokepast.es/img/pokemon/382-0.png');
		//const Pokemon3 = new Pokemon('Thundurus', 'Life Orb', 'Defiant', 50, '252 Atk / 4 SpD / 252 Spe', 'Jolly', 'Wild Charge', 'Fly', 'U-Turn', 'Protect', 'https://pokepast.es/img/pokemon/642-0.png');
		//const Pokemon4 = new Pokemon('Whimsicott', 'Focus Sash', 'Prankster', 50, '4 HP / 252 SpA / 252 Spe', 'Timid', 'Tailwind', 'Moonblast', 'Taunt', 'Encore', 'https://pokepast.es/img/pokemon/547-0.png');
		//const Pokemon5 = new Pokemon('Incineroar', 'Sitrus Berry', 'Intimidate', 50, '252 HP / 4 Atk / 252 SpD', 'Careful', 'Flare Blitz', 'Darkest Lariat', 'Parting Shot', 'Fake Out', 'https://pokepast.es/img/pokemon/727-0.png');
		//const Pokemon6 = new Pokemon('Amoonguss', 'Coba Berry', 'Regenerator', 50, '236 HP / 116 Def / 156 SpD', 'Calm', 'Giga Drain', 'Spore', 'Rage Powder', 'Protect', 'https://pokepast.es/img/pokemon/591-0.png');
		return {'pokemon1': Pokemon1};//, 'pokemon2': Pokemon2, 'pokemon3': Pokemon3, 'pokemon4': Pokemon4, 'pokemon5': Pokemon5, 'pokemon6': Pokemon6};
	}
	
};


class Pokemon
{
	constructor(name, item, ability, level, nature, move1, move2, move3, move4, thumbnail, hpEV="0", atkEV="0", defEV="0", spaEV="0", spdEV="0", speEV="0", hpIV=31, atkIV=31, defIV=31, spaIV=31, spdIV=31, speIV=31)
	{
		this.name = name;
		this.item = item;
		this.ability = ability;
		this.level = level;
		this.atkEV = atkEV;
		this.defEV = defEV;
		this.hpEV = hpEV;
		this.spaEV = spaEV;
		this.spdEV = spdEV;
		this.speEV = speEV;
		this.atkIV = atkIV;
		this.defIV = defIV;
		this.hpIV = hpIV;
		this.spaIV = spaIV;
		this.spdIV = spdIV;
		this.speIV = speIV;
		this.nature = nature;
		this.move1 = move1;
		this.move2 = move2;
		this.move3 = move3;
		this.move4 = move4;
		this.thumbnail = thumbnail;
	}
	formatEVs()
	{
		let evs = [];
		if(this.hpEV != '0')
		{
			evs.push(`${this.hpEV} HP`);
		}
		if(this.atkEV != '0')
		{
			evs.push(`${this.atkEV} Atk`);
		}
		if(this.defEV != '0')
		{
			evs.push(`${this.defEV} Def`);
		}
		if(this.spaEV != '0')
		{
			evs.push(`${this.spaEV} SpA`);
		}
		if(this.spdEV != '0')
		{
			evs.push(`${this.spdEV} SpD`);
		}
		if(this.speEV != '0')
		{
			evs.push(`${this.speEV} Spe`);
		}
		return evs.join(' / ');
	}
	toEmbed()
	{
		const embed = new EmbedBuilder().setTitle(`${this.name} @ ${this.item}`).setDescription(`Ability: ${this.ability}\nLevel: ${this.level}\nEVs: ${this.formatEVs()}\n${this.nature} Nature\n- ${this.move1}\n- ${this.move2}\n- ${this.move3}\n- ${this.move4}\n\n[Calc me!](https://pikalytics.com/calc?attSet=${this.toURI()})`).setThumbnail(`${this.thumbnail}`);
		return embed;
	}
	toURI()
	{
		const data = 
		{
			"name": this.name,
			"set":
			{
				"ability": this.ability,
				"evs":
				{
					"at": this.atkEV,
					"df": this.defEV,
					"hp": this.hpEV,
					"sa": this.spaEV,
					"sd": this.spdEV,
					"sp": this.speEV
				},
				"item": this.item,
				"level": this.level,
				"moves": [this.move1, this.move2, this.move3, this.move4],
				"ivs": {"atk": this.atkIV, "def": this.defIV, "hp": this.hpIV, "spa": this.spaIV, "spd": this.spdIV, "spe": this.speIV},
				"nature": this.nature
			}
		};
		return encodeURI(btoa(JSON.stringify(data)));
	}
}