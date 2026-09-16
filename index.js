const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
    console.log(`¡Bot conectado con éxito como ${client.user.tag}!`);

    // Definición del comando slash elegante
    const commands = [
        new SlashCommandBuilder()
            .setName('embed')
            .setDescription('Crea un anuncio o embed profesional y elegante')
            .addStringOption(option =>
                option.setName('titulo')
                    .setDescription('Título principal del embed')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('descripcion')
                    .setDescription('Mensaje principal o contenido del embed')
                    .setRequired(true))
            .addStringOption(option =>
                option.setName('footer')
                    .setDescription('Texto pequeño para el pie de página (Opcional)')
                    .setRequired(false))
    ];

    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
        console.log('Actualizando comandos de barra (/) ...');
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands },
        );
        console.log('¡Comandos globales registrados correctamente!');
    } catch (error) {
        console.error('Error al registrar comandos:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'embed') {
        const titulo = interaction.options.getString('titulo');
        const descripcion = interaction.options.getString('descripcion');
        const footerTexto = interaction.options.getString('footer') || `Creado por ${interaction.user.tag}`;

        // Menú desplegable con colores estéticos y modernos
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('select_embed_color')
                .setPlaceholder('🎨 Elige la gama de colores de tu Embed')
                .addOptions([
                    { label: 'Azul Neón / Cyber', value: '#2F3136_blue', description: 'Azul eléctrico moderno (#0099FF)', emoji: '💠' },
                    { label: 'Verde Esmeralda', value: '#2F3136_green', description: 'Ideal para aceptaciones o éxito (#2ECC71)', emoji: '🟢' },
                    { label: 'Rojo Alerta / Importante', value: '#2F3136_red', description: 'Ideal برای avisos o reglas (#E74C3C)', emoji: '🔴' },
                    { label: 'Dorado / Premium', value: '#2F3136_gold', description: 'Estilo elegante y lujoso (#F1C40F)', emoji: '🟡' },
                    { label: 'Morado / Violeta', value: '#2F3136_purple', description: 'Estilo oscuro y limpio (#9B59B6)', emoji: '🟣' },
                    { label: 'Negro Oscuro (Minimalista)', value: '#23272A', description: 'Diseño sobrio y profesional (#23272A)', emoji: '⬛' }
                ]),
        );

        await interaction.reply({
            content: `✨ Has redactado tu embed con éxito.\n👇 **Paso final:** Selecciona el estilo de color que deseas aplicar:`,
            components: [row],
            ephemeral: true
        });

        // Colector seguro para la respuesta del usuario (duración 2 minutos)
        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

        collector.on('collect', async i => {
            if (i.customId === 'select_embed_color') {
                let colorHex = '#5865F2'; // Color por defecto

                // Asignar colores basados en la selección
                switch (i.values[0]) {
                    case '#2F3136_blue': colorHex = '#0099FF'; break;
                    case '#2F3136_green': colorHex = '#2ECC71'; break;
                    case '#2F3136_red': colorHex = '#E74C3C'; break;
                    case '#2F3136_gold': colorHex = '#F1C40F'; break;
                    case '#2F3136_purple': colorHex = '#9B59B6'; break;
                    case '#23272A': colorHex = '#23272A'; break;
                }

                // Construcción del Embed elegante
                const elegantEmbed = new EmbedBuilder()
                    .setTitle(`📌 ${titulo}`)
                    .setDescription(descripcion)
                    .setColor(colorHex)
                    .setTimestamp()
                    .setFooter({ 
                        text: footerTexto, 
                        iconURL: interaction.user.displayAvatarURL() 
                    });

                await i.update({ 
                    content: '🚀 **¡Embed publicado con éxito en el canal!**', 
                    components: [] 
                });

                await interaction.channel.send({ embeds: [elegantEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                interaction.editReply({ content: '⏱️ El tiempo para seleccionar el color ha expirado. Usa `/embed` de nuevo.', components: [] }).catch(() => {});
            }
        });
    }
});

client.login(process.env.DISCORD_TOKEN);

