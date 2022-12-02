const {SlashCommandBuilder} = require('@discordjs/builders');
const {ActionRowBuilder, SelectMenuBuilder, ButtonBuilder, ButtonStyle, SelectMenuOptionBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder} = require('discord.js');
const axios = require('axios');
const jsdom = require('jsdom');


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
		try
		{
			const paste = interaction.fields.getTextInputValue('rmtPokepasteInput');
			const description = interaction.fields.getTextInputValue('rmtDescription');
			const struggles = interaction.fields.getTextInputValue('rmtStruggles');
			const details = interaction.fields.getTextInputValue('rmtDetails');
			const embed = new EmbedBuilder().setTitle('Rate My Team!').setAuthor({name: interaction.member.user.username}).setDescription(`**Paste:** ${paste}\n\n**Summary:**\n\n${description}\n\n**Struggles:**\n\n${struggles}\n\n**Special Details:**\n${details}`);
			await interaction.reply({embeds: [embed]});
			const message = await interaction.fetchReply();
			const thread = await message.startThread({name: `${interaction.member.user.username}'s RMT`, autoArchiveDuration: 60, reason: 'RMT Thread'});
			const team = await this.ScrapePokemon(paste);
			const row0 = new ActionRowBuilder();
			const row1 = new ActionRowBuilder();
			for(let pokemon = 0; pokemon < Object.keys(team).length; pokemon++)
			{
				if(pokemon < 5)
				{
					row0.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon${pokemon+1}`).setLabel(team[`pokemon${pokemon+1}`].name).setStyle(ButtonStyle.Primary));
				}
				else
				{
					row1.addComponents(new ButtonBuilder().setCustomId(`rmtPokemon${pokemon+1}`).setLabel(team[`pokemon${pokemon+1}`].name).setStyle(ButtonStyle.Primary));
				}
			}
			row1.addComponents(new ButtonBuilder().setCustomId(`rmtShowAll`).setLabel('Show Team').setStyle(ButtonStyle.Primary));
			const threadMessage = await thread.send({components: [row0, row1]});
			this.messages[threadMessage.id] = team;
		}
		catch(error)
		{
			console.log(error);
			await interaction.followUp({content: 'There was a problem with your paste!', ephemeral: true});
		}
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
		try
		{
			const response = await axios.get(url);
			const dom = new jsdom.JSDOM(response.data);
			const doc = dom.window.document;
			const articles = doc.querySelectorAll('article');
			const pokemon = [];
			for(let article = 0; article < articles.length; article++)
			{
				const text = articles[article].textContent;
				const lines = text.split('\n');
				console.log(lines);
				let lineIndex = 4;
				for(let line = 0; line < lines.length; line++)
				{
					if(lines[line].includes('@'))
					{
						lineIndex = line;
						break;
					}
				}
				const name = lines[lineIndex].split('@')[0].replace('(M)', '').replace('(F)', '').replace('-Gmax', '').trim();
				let item = '';
				try
				{
					item = lines[lineIndex].split('@')[1].trim();
				}
				catch(error)
				{
					console.log(error)
				}
				const ability = lines[lineIndex+1].split(':')[1].trim();
				let level = '50';
				if(lines[lineIndex+2].includes('Level'))
				{
					level = lines[lineIndex+2].split(':')[1].trim();
				}
				else
				{
					lineIndex--;
				}
				let shinyString = '';
				if(lines[lineIndex+3].includes('Shiny'))
				{
					lineIndex++;
				}
				let evString = '';
				try
				{
					if(lines[lineIndex+3].includes('EVs:'))
					{
						evString = lines[lineIndex+3].split(':')[1].trim();
					}
					else
					{
						lineIndex--;
					}
				}
				catch(error)
				{
					console.log(error);
				}
				let nature = '';
				try
				{
					if(lines[lineIndex+4].includes(' Nature'))
					{
						nature = lines[lineIndex+4].split(' ')[0].trim();
					}
					else
					{
						lineIndex--
					}
				} 
				catch(error)
				{
					console.log(error);
				}
				let ivString = '';
				let move1 = '';
				let move2 = '';
				let move3 = '';
				let move4 = '';
				if(lines[lineIndex+5].includes('IVs:'))
				{
					ivString = lines[lineIndex+5].split(':')[1].trim();
					try
					{
						move1 = lines[lineIndex+6].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move2 = lines[lineIndex+7].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move3 = lines[lineIndex+8].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move4 = lines[lineIndex+9].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
				}
				else
				{
					try
					{
						move1 = lines[lineIndex+5].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move2 = lines[lineIndex+6].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move3 = lines[lineIndex+7].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
					try
					{
						move4 = lines[lineIndex+8].split('-').splice(1).join('-').trim();
					}
					catch(error)
					{
						console.log(error);
					}
				}
				let hpEV = 0;
				let atkEV = 0;
				let defEV = 0;
				let spaEV = 0;
				let spdEV = 0;
				let speEV = 0;
				const evList = evString.split('/');
				for(let ev = 0; ev < evList.length; ev++)
				{
					if(evList[ev].includes('HP'))
					{
						hpEV = evList[ev].trim().split(' ')[0].trim();
					}
					else if(evList[ev].trim().includes('Atk'))
					{
						atkEV = evList[ev].trim().split(' ')[0].trim();
					}
					else if(evList[ev].trim().includes('Def'))
					{
						defEV = evList[ev].trim().split(' ')[0].trim();
					}
					else if(evList[ev].trim().includes('SpA'))
					{
						spaEV = evList[ev].trim().split(' ')[0].trim();
					}
					else if(evList[ev].includes('SpD'))
					{
						spdEV = evList[ev].trim().split(' ')[0].trim();
					}
					else if(evList[ev].trim().includes('Spe'))
					{
						speEV = evList[ev].trim().split(' ')[0].trim();
					}
				}
				let hpIV = 31;
				let atkIV = 31;
				let defIV = 31;
				let spaIV = 31;
				let spdIV = 31;
				let speIV = 31;
				const ivList = ivString.split('/');
				for(let iv = 0; iv < ivList.length; iv++)
				{
					if(ivList[iv].includes('HP'))
					{
						hpIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
					else if(ivList[iv].includes('Atk'))
					{
						atkIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
					else if(ivList[iv].includes('Def'))
					{
						defIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
					else if(ivList[iv].includes('SpA'))
					{
						spaIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
					else if(ivList[iv].includes('SpD'))
					{
						spdIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
					else if(ivList[iv].includes('Spe'))
					{
						speIV = parseInt(ivList[iv].trim().split(' ')[0].trim());
					}
				}
				let image = '';
				try
				{
					image = `https://pokepast.es/${articles[article].childNodes[1].childNodes[1].src}`;
				}
				catch
				{
					image = '';
				}
				pokemon.push(new Pokemon(name, item, ability, parseInt(level), nature, move1, move2, move3, move4, image, hpEV, atkEV, defEV, spaEV, spdEV, speEV, hpIV, atkIV, defIV, spaIV, spdIV, speIV));
			}
			let team = {};
			for(let mon = 0; mon < pokemon.length; mon++)
			{
				team[`pokemon${mon+1}`] = pokemon[mon];
			}
			return team;
		}
		//return {'pokemon1': Pokemon1};//, 'pokemon2': Pokemon2, 'pokemon3': Pokemon3, 'pokemon4': Pokemon4, 'pokemon5': Pokemon5, 'pokemon6': Pokemon6};
		catch(error)
		{
			console.log(error);
			return {};
		}
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
	formatIVs()
	{
		let ivs = [];
		if(this.hpIV != 31)
		{
			ivs.push(`${this.hpIV} HP`);
		}
		if(this.atkIV != 31)
		{
			ivs.push(`${this.atkIV} Atk`);
		}
		if(this.defIV != 31)
		{
			ivs.push(`${this.defIV} Def`);
		}
		if(this.spaIV != 31)
		{
			ivs.push(`${this.spaIV} SpA`);
		}
		if(this.spdIV != 31)
		{
			ivs.push(`${this.spdIV} SpD`);
		}
		if(this.speIV != 31)
		{
			ivs.push(`${this.speIV} Spe`);
		}
		if(ivs.length == 0)
		{
			return ''
		}
		else
		{
			return 'IVs: ' + ivs.join(' / ');
		}

	}
	toEmbed()
	{
		const embed = new EmbedBuilder().setTitle(`${this.name} @ ${this.item}`).setDescription(`Ability: ${this.ability}\nLevel: ${this.level}\nEVs: ${this.formatEVs()}\n${this.nature} Nature\n${this.formatIVs()}\n- ${this.move1}\n- ${this.move2}\n- ${this.move3}\n- ${this.move4}\n\n[Calc me!](https://pikalytics.com/calc?attSet=${this.toURI()})`).setThumbnail(`${this.thumbnail}`);
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