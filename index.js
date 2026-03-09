require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  StringSelectMenuBuilder,
  UserSelectMenuBuilder,
  ChannelType,
} = require("discord.js");

const {
  DISCORD_TOKEN,
  CLIENT_ID,
  GUILD_ID,
  PANEL_CHANNEL_ID,
  PATROL_START_CHANNEL_ID,
  PATROL_END_CHANNEL_ID,
} = process.env;

if (
  !DISCORD_TOKEN ||
  !CLIENT_ID ||
  !GUILD_ID ||
  !PANEL_CHANNEL_ID ||
  !PATROL_START_CHANNEL_ID ||
  !PATROL_END_CHANNEL_ID
) {
  console.error("❌ Lipsesc variabile în .env");
  process.exit(1);
}

const PANEL_TEMP_DELETE_MS = 5 * 60 * 1000;

/* ================= VEHICLE LIST PE GRADE ================= */

const VEHICLES_BY_RANK = {
  agent: [
    { label: "Charger", value: "Charger" },
  ],

  agent_principal: [
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
  ],

  agent_sef_adjunct: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
  ],

  agent_sef: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Trx", value: "Trx" },
  ],

  agent_sef_principal: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Trx", value: "Trx" },
  ],

  subinspector: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Trx", value: "Trx" },
  ],

  inspector: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Trx", value: "Trx" },
  ],

  inspector_principal: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Trx", value: "Trx" },
  ],

  subcomisar: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Trx", value: "Trx" },
  ],

  comisar: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Trx", value: "Trx" },
  ],

  comisar_sef: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Trx", value: "Trx" },
  ],

  sub_chestor: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Bugati", value: "Bugati" },
    { label: "Trx", value: "Trx" },
  ],

  chestor_general: [
    { label: "Charger", value: "Charger" },
    { label: "Ford Jeep", value: "Ford Jeep" },
    { label: "Bmw M5", value: "Bmw M5" },
    { label: "Elicopter", value: "Elicopter" },
    { label: "Audi Rs7", value: "Audi Rs7" },
    { label: "Insurgent", value: "Insurgent" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Transport Munitie", value: "Transport Munitie" },
    { label: "Range Rover", value: "Range Rover" },
    { label: "Mercedes GT", value: "Mercedes GT" },
    { label: "Autobuz", value: "Autobuz" },
    { label: "Trx", value: "Trx" },
    { label: "Bugati", value: "Bugati" },
  ],
};

/* ================= ROLE IDS ================= */
/* ÎNLOCUIEȘTE CU ID-URILE TALE REALE */

const RANK_ROLES = {

  agent: "1479937563467845722",
  agent_principal: "1479937860357591224",
  agent_sef_adjunct: "1479937949809377404",
  agent_sef: "1479938054259998984",
  agent_sef_principal: "1479938118491574534",

  subinspector: "1479938188524130539",
  inspector: "1479938247554502867",
  inspector_principal: "1479938306580938784",

  subcomisar: "1479938369101234217",
  comisar: "1479938441096597625",
  comisar_sef: "1479938499057680406",

  sub_chestor: "1479938560432934953",
  chestor_general: "1479938620268871764",

};

/* ================= STORAGE ================= */

const pendingPatrols = new Map();
/*
userId => {
  partnerId,
  partnerLabel,
  vehicle
}
*/

const activePatrols = new Map();
/*
messageId => {
  officerId,
  officerTag,
  officerName,
  partnerId,
  partnerLabel,
  vehicle,
  zone,
  status,
  startedAt,
  startMessageId
}
*/

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  partials: [Partials.Channel],
});

/* ================= HELPERS ================= */

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}:${ss}`;
}

async function sendTempMessage(channel, payload, ttl = PANEL_TEMP_DELETE_MS) {
  const msg = await channel.send(payload).catch(() => null);
  if (!msg) return null;

  setTimeout(async () => {
    await msg.delete().catch(() => {});
  }, ttl);

  return msg;
}

    function getVehiclesForMember(member) {
      if (!member?.roles?.cache) {
        return [];
      }
    
      if (member.roles.cache.has(RANK_ROLES.chestor_general)) {
        return VEHICLES_BY_RANK.chestor_general;
      }
    
      if (member.roles.cache.has(RANK_ROLES.sub_chestor)) {
        return VEHICLES_BY_RANK.sub_chestor;
      }
    
      if (member.roles.cache.has(RANK_ROLES.comisar_sef)) {
        return VEHICLES_BY_RANK.comisar_sef;
      }
    
      if (member.roles.cache.has(RANK_ROLES.comisar)) {
        return VEHICLES_BY_RANK.comisar;
      }
    
      if (member.roles.cache.has(RANK_ROLES.subcomisar)) {
        return VEHICLES_BY_RANK.subcomisar;
      }
    
      if (member.roles.cache.has(RANK_ROLES.inspector_principal)) {
        return VEHICLES_BY_RANK.inspector_principal;
      }
    
      if (member.roles.cache.has(RANK_ROLES.inspector)) {
        return VEHICLES_BY_RANK.inspector;
      }
    
      if (member.roles.cache.has(RANK_ROLES.subinspector)) {
        return VEHICLES_BY_RANK.subinspector;
      }
    
      if (member.roles.cache.has(RANK_ROLES.agent_sef_principal)) {
        return VEHICLES_BY_RANK.agent_sef_principal;
      }
    
      if (member.roles.cache.has(RANK_ROLES.agent_sef)) {
        return VEHICLES_BY_RANK.agent_sef;
      }
    
      if (member.roles.cache.has(RANK_ROLES.agent_sef_adjunct)) {
        return VEHICLES_BY_RANK.agent_sef_adjunct;
      }
    
      if (member.roles.cache.has(RANK_ROLES.agent_principal)) {
        return VEHICLES_BY_RANK.agent_principal;
      }
    
      if (member.roles.cache.has(RANK_ROLES.agent)) {
        return VEHICLES_BY_RANK.agent;
      }
    
      return [];
    }

function buildPanelEmbed() {
  return new EmbedBuilder()
    .setColor(0x1f8b4c)
    .setTitle("🚓 Sistem Patrule Poliție")
    .setDescription(
      [
        "Apasă pe butonul de mai jos pentru a crea o patrulă nouă.",
        "",
        "**Flux creare patrulă:**",
        "1. Selectezi partenerul",
        "2. Selectezi vehiculul",
        "3. Completezi zona și statusul",
        "4. Botul pornește automat timer-ul",
        "5. La final se generează raport automat",
      ].join("\n")
    )
    .setFooter({ text: "Moldova RP • Patrule automate" })
    .setTimestamp();
}

function buildStartEmbed(data) {
  return new EmbedBuilder()
    .setColor(0x00a8ff)
    .setTitle("🚔 Patrulă începută")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status", value: data.status, inline: true },
      {
        name: "⏱️ Început",
        value: `<t:${Math.floor(data.startedAt / 1000)}:f>`,
        inline: false,
      }
    )
    .setFooter({ text: "Moldova RP • Patrulă activă" })
    .setTimestamp();
}

function buildClosedStartEmbed(data, closedBy, durationText) {
  return new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("🛑 Patrulă închisă")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status", value: data.status, inline: true },
      {
        name: "⏱️ Început",
        value: `<t:${Math.floor(data.startedAt / 1000)}:f>`,
        inline: false,
      },
      { name: "🕒 Durată totală", value: durationText, inline: true },
      { name: "🔒 Închisă de", value: `<@${closedBy}>`, inline: true }
    )
    .setFooter({ text: "Moldova RP • Patrulă închisă" })
    .setTimestamp();
}

function buildEndReportEmbed(data, closedBy, durationText) {
  return new EmbedBuilder()
    .setColor(0x2b2d31)
    .setTitle("📋 Raport automat patrulă")
    .addFields(
      { name: "👮 Ofițer", value: `<@${data.officerId}>`, inline: true },
      { name: "🤝 Partener", value: data.partnerLabel, inline: true },
      { name: "🚓 Vehicul", value: data.vehicle, inline: true },
      { name: "📍 Zona", value: data.zone, inline: true },
      { name: "📡 Status inițial", value: data.status, inline: true },
      {
        name: "🕒 Început",
        value: `<t:${Math.floor(data.startedAt / 1000)}:f>`,
        inline: true,
      },
      {
        name: "🛑 Final",
        value: `<t:${Math.floor(Date.now() / 1000)}:f>`,
        inline: true,
      },
      { name: "⏱️ Durată patrulă", value: durationText, inline: true },
      { name: "🔒 Închisă de", value: `<@${closedBy}>`, inline: true }
    )
    .setFooter({ text: "Moldova RP • Patrule terminate" })
    .setTimestamp();
}

/* ================= SLASH COMMANDS ================= */

const commands = [
  new SlashCommandBuilder()
    .setName("patrula-panel")
    .setDescription("Trimite panoul pentru sistemul de patrule")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
].map((cmd) => cmd.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

  try {
    console.log("🔄 Înregistrez comenzile slash...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Comenzile slash au fost înregistrate.");
  } catch (err) {
    console.error("❌ Eroare la înregistrarea comenzilor:", err);
  }
}

/* ================= READY ================= */

client.once("clientReady", async () => {
  console.log(`✅ Bot pornit ca ${client.user.tag}`);
  await registerCommands();
});

/* ================= INTERACTIONS ================= */

client.on("interactionCreate", async (interaction) => {
  try {
    /* ---------- Slash ---------- */
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "patrula-panel") {
        if (interaction.channelId !== PANEL_CHANNEL_ID) {
          return interaction.reply({
            content: "❌ Această comandă poate fi folosită doar în canalul de panel.",
            ephemeral: true,
          });
        }

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("patrol_create_start")
            .setLabel("Creează patrulă")
            .setStyle(ButtonStyle.Primary)
            .setEmoji("🚔")
        );

        await interaction.reply({
          embeds: [buildPanelEmbed()],
          components: [row],
        });
      }
      return;
    }

    /* ---------- Start creation ---------- */
    if (interaction.isButton() && interaction.customId === "patrol_create_start") {
      const userSelect = new UserSelectMenuBuilder()
        .setCustomId("patrol_select_partner")
        .setPlaceholder("Selectează partenerul de patrulă")
        .setMinValues(1)
        .setMaxValues(1);

      const row = new ActionRowBuilder().addComponents(userSelect);

      await interaction.reply({
        content: "👥 Selectează partenerul din listă:",
        components: [row],
        ephemeral: true,
      });
      return;
    }

    /* ---------- Select partner ---------- */
    if (interaction.isUserSelectMenu() && interaction.customId === "patrol_select_partner") {
      const partnerId = interaction.values[0];
      const partnerMember = await interaction.guild.members.fetch(partnerId).catch(() => null);
    
      if (!partnerMember) {
        return interaction.update({
          content: "❌ Nu am putut găsi partenerul selectat.",
          components: [],
        });
      }
    
      const creatorMember = await interaction.guild.members
        .fetch(interaction.user.id)
        .catch(() => null);
    
      if (!creatorMember) {
        return interaction.update({
          content: "❌ Nu am putut găsi datele tale pe server.",
          components: [],
        });
      }
    
      const vehicles = getVehiclesForMember(creatorMember);
    
      if (!vehicles.length) {
        return interaction.update({
          content: "❌ Nu ai niciun vehicul disponibil pentru gradul tău. Verifică rolurile setate în bot.",
          components: [],
        });
      }
    
      pendingPatrols.set(interaction.user.id, {
        partnerId,
        partnerLabel: `<@${partnerId}>`,
      });
    
      const vehicleMenu = new StringSelectMenuBuilder()
        .setCustomId("patrol_select_vehicle")
        .setPlaceholder("Selectează vehiculul de patrulă")
        .addOptions(vehicles);
    
      const row = new ActionRowBuilder().addComponents(vehicleMenu);
    
      await interaction.update({
        content: `✅ Partener selectat: <@${partnerId}>\n\n🚓 Acum selectează vehiculul:`,
        components: [row],
      });
      return;
    }

    /* ---------- Select vehicle ---------- */
    if (interaction.isStringSelectMenu() && interaction.customId === "patrol_select_vehicle") {
      const data = pendingPatrols.get(interaction.user.id);

      if (!data) {
        return interaction.update({
          content: "❌ Sesiunea a expirat. Apasă din nou pe butonul de creare patrulă.",
          components: [],
        });
      }

      data.vehicle = interaction.values[0];
      pendingPatrols.set(interaction.user.id, data);

      const modal = new ModalBuilder()
        .setCustomId("patrol_modal_details")
        .setTitle("Detalii patrulă");

      const zoneInput = new TextInputBuilder()
        .setCustomId("zone")
        .setLabel("Zona")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: Spital / Vinewood / Centru / Vespuci / Groove")
        .setRequired(true)
        .setMaxLength(100);

      const statusInput = new TextInputBuilder()
        .setCustomId("status")
        .setLabel("Status")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Ex: Patrulă / Filtru / Control trafic")
        .setRequired(true)
        .setMaxLength(100);

      modal.addComponents(
        new ActionRowBuilder().addComponents(zoneInput),
        new ActionRowBuilder().addComponents(statusInput)
      );

      await interaction.showModal(modal);
      return;
    }

    /* ---------- Modal submit ---------- */
    if (interaction.isModalSubmit() && interaction.customId === "patrol_modal_details") {
      const temp = pendingPatrols.get(interaction.user.id);

      if (!temp || !temp.partnerId || !temp.vehicle) {
        return interaction.reply({
          content: "❌ Sesiunea de creare a patrulei a expirat. Reîncearcă.",
          ephemeral: true,
        });
      }

      const zone = interaction.fields.getTextInputValue("zone");
      const status = interaction.fields.getTextInputValue("status");

      const startChannel = await client.channels.fetch(PATROL_START_CHANNEL_ID).catch(() => null);
      const panelChannel = await client.channels.fetch(PANEL_CHANNEL_ID).catch(() => null);

      if (!startChannel || startChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul pentru patrule începute nu este valid.",
          ephemeral: true,
        });
      }

      if (!panelChannel || panelChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul de panel nu este valid.",
          ephemeral: true,
        });
      }

      const startedAt = Date.now();

      const patrolData = {
        officerId: interaction.user.id,
        officerTag: interaction.user.tag,
        officerName: interaction.user.username,
        partnerId: temp.partnerId,
        partnerLabel: temp.partnerLabel,
        vehicle: temp.vehicle,
        zone,
        status,
        startedAt,
      };

      const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`patrol_close:${interaction.user.id}`)
          .setLabel("Închide patrula")
          .setStyle(ButtonStyle.Danger)
          .setEmoji("🛑")
      );

      const patrolMsg = await startChannel.send({
        embeds: [buildStartEmbed(patrolData)],
        components: [buttons],
      });

      activePatrols.set(patrolMsg.id, {
        ...patrolData,
        startMessageId: patrolMsg.id,
      });

      pendingPatrols.delete(interaction.user.id);

      await sendTempMessage(panelChannel, {
        content:
          `✅ <@${interaction.user.id}> a început o patrulă cu ${temp.partnerLabel}.\n` +
          `📍 Zona: **${zone}**\n` +
          `🚓 Vehicul: **${temp.vehicle}**\n` +
          `🕒 Acest mesaj se va șterge automat în 5 minute.`,
      });

      await interaction.reply({
        content: `✅ Patrula a fost pornită.\n📢 Mesajul a fost trimis în <#${PATROL_START_CHANNEL_ID}>.`,
        ephemeral: true,
      });

      return;
    }

    /* ---------- Close patrol ---------- */
    if (interaction.isButton() && interaction.customId.startsWith("patrol_close:")) {
      const ownerId = interaction.customId.split(":")[1];
      const patrolMessageId = interaction.message.id;
      const patrolData = activePatrols.get(patrolMessageId);

      if (!patrolData) {
        return interaction.reply({
          content: "❌ Nu am găsit datele acestei patrule.",
          ephemeral: true,
        });
      }

      const canClose =
        interaction.user.id === ownerId ||
        interaction.member.permissions.has(PermissionFlagsBits.ManageMessages) ||
        interaction.member.permissions.has(PermissionFlagsBits.Administrator);

      if (!canClose) {
        return interaction.reply({
          content: "⛔ Doar creatorul patrulei sau conducerea o poate închide.",
          ephemeral: true,
        });
      }

      const endChannel = await client.channels.fetch(PATROL_END_CHANNEL_ID).catch(() => null);
      if (!endChannel || endChannel.type !== ChannelType.GuildText) {
        return interaction.reply({
          content: "❌ Canalul pentru patrule terminate nu este valid.",
          ephemeral: true,
        });
      }

      const durationMs = Date.now() - patrolData.startedAt;
      const durationText = formatDuration(durationMs);

      const disabledRow = new ActionRowBuilder().addComponents(
        ButtonBuilder.from(interaction.message.components[0].components[0]).setDisabled(true)
      );

      await interaction.update({
        embeds: [buildClosedStartEmbed(patrolData, interaction.user.id, durationText)],
        components: [disabledRow],
      });

      await endChannel.send({
        embeds: [buildEndReportEmbed(patrolData, interaction.user.id, durationText)],
      });

      activePatrols.delete(patrolMessageId);
      return;
    }
  } catch (err) {
    console.error("❌ Eroare interactionCreate:", err);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "❌ A apărut o eroare.",
        ephemeral: true,
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: "❌ A apărut o eroare.",
        ephemeral: true,
      }).catch(() => {});
    }
  }
});


client.login(DISCORD_TOKEN);
