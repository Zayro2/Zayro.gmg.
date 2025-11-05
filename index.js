require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] 
});

const ROLE_PRINCIPAL_ID = '1435735166378311790'; // Rôle qui donne accès au serveur
const ROLE_NON_VERIF_ID = '1435738797768704071'; // Rôle non vérifié
const CHANNEL_ID = '1430749539605811200'; // Channel du règlement

client.once('ready', async () => {
    console.log(`Zayro est connecté en tant que ${client.user.tag}!`);

    const channel = await client.channels.fetch(CHANNEL_ID);

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('lu')
                .setLabel('✅ Lu')
                .setStyle(ButtonStyle.Success)
        );

    await channel.send({ content: "Bienvenue sur le serveur !\n\nMerci de lire le règlement et cliquez sur **Lu** pour avoir accès au reste du serveur.", components: [row] });
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'lu') {
        const member = interaction.member;

        if (member.roles.cache.has(ROLE_NON_VERIF_ID)) {
            await member.roles.remove(ROLE_NON_VERIF_ID);
        }

        await member.roles.add(ROLE_PRINCIPAL_ID);

        await interaction.reply({ content: "Merci d'avoir lu le règlement ! Vous avez maintenant accès au serveur.", ephemeral: true });
    }
});

client.on('guildMemberAdd', async member => {
    await member.roles.add(ROLE_NON_VERIF_ID);
});

client.login(process.env.DISCORD_TOKEN);
